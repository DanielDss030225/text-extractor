import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  extraction: router({
    extract: protectedProcedure
      .input((val: unknown) => {
        if (typeof val !== 'object' || val === null) throw new Error('Invalid input');
        const obj = val as Record<string, unknown>;
        if (typeof obj.fileContent !== 'string') throw new Error('fileContent must be base64 string');
        if (typeof obj.fileName !== 'string') throw new Error('fileName is required');
        if (typeof obj.fileType !== 'string') throw new Error('fileType must be image or pdf');
        return {
          fileContent: obj.fileContent,
          fileName: obj.fileName,
          fileType: obj.fileType as 'image' | 'pdf',
        };
      })
      .mutation(async ({ ctx, input }) => {
        const { invokeLLM } = await import('./_core/llm');
        const { createExtraction } = await import('./db');

        try {
          // Determine MIME type based on file type
          const mimeType = input.fileType === 'pdf' ? 'application/pdf' : 'image/jpeg';
          
          // Call LLM with vision capability to extract text
          const response = await invokeLLM({
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: 'Please extract and transcribe all text from this image or document. Return only the extracted text, preserving formatting as much as possible.',
                  },
                  {
                    type: 'image_url',
                    image_url: {
                      url: `data:${mimeType};base64,${input.fileContent}`,
                      detail: 'high',
                    },
                  },
                ],
              },
            ],
          });

          const extractedText = response.choices[0]?.message?.content || '';

          // Save to database
          await createExtraction({
            userId: ctx.user.id,
            fileName: input.fileName,
            fileType: input.fileType,
            extractedText: extractedText as string,
          });

          return {
            success: true,
            text: extractedText,
          };
        } catch (error) {
          console.error('Text extraction error:', error);
          throw new Error('Failed to extract text from file');
        }
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      const { getUserExtractions } = await import('./db');
      return await getUserExtractions(ctx.user.id);
    }),

    delete: protectedProcedure
      .input((val: unknown) => {
        if (typeof val !== 'object' || val === null) throw new Error('Invalid input');
        const obj = val as Record<string, unknown>;
        if (typeof obj.id !== 'number') throw new Error('id must be a number');
        return { id: obj.id };
      })
      .mutation(async ({ input }) => {
        const { deleteExtraction } = await import('./db');
        const success = await deleteExtraction(input.id);
        return { success };
      }),
  }),
});

export type AppRouter = typeof appRouter;
