import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Copy, Download, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function Extractor() {
  const { user } = useAuth();
  const [extractedText, setExtractedText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractMutation = trpc.extraction.extract.useMutation();
  const listQuery = trpc.extraction.list.useQuery();
  const deleteMutation = trpc.extraction.delete.useMutation();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      toast.error("Tipo de arquivo não suportado. Use PNG, JPG ou PDF.");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Máximo 10MB.");
      return;
    }

    setIsExtracting(true);
    setSelectedFileName(file.name);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Content = (e.target?.result as string)?.split(",")[1];
        if (!base64Content) {
          toast.error("Erro ao ler arquivo");
          setIsExtracting(false);
          return;
        }

        try {
          const result = await extractMutation.mutateAsync({
            fileContent: base64Content,
            fileName: file.name,
            fileType: file.type === "application/pdf" ? "pdf" : "image",
          });

          setExtractedText(result.text as string);
          toast.success("Texto extraído com sucesso!");
          
          // Refresh extraction history
          await listQuery.refetch();
        } catch (error) {
          toast.error("Erro ao extrair texto do arquivo");
          console.error(error);
        } finally {
          setIsExtracting(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Erro ao processar arquivo");
      setIsExtracting(false);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCopyText = () => {
    if (!extractedText) {
      toast.error("Nenhum texto para copiar");
      return;
    }
    navigator.clipboard.writeText(extractedText);
    toast.success("Texto copiado para a área de transferência!");
  };

  const handleDownloadText = () => {
    if (!extractedText) {
      toast.error("Nenhum texto para baixar");
      return;
    }
    const element = document.createElement("a");
    element.setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent(extractedText)}`);
    element.setAttribute("download", `${selectedFileName || "extracted"}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Arquivo baixado!");
  };

  const handleDeleteExtraction = async (id: number) => {
    try {
      await deleteMutation.mutateAsync({ id });
      await listQuery.refetch();
      toast.success("Extração removida");
    } catch (error) {
      toast.error("Erro ao remover extração");
    }
  };

  const handleClearText = () => {
    setExtractedText("");
    setSelectedFileName("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Text Extractor</h1>
          <p className="text-gray-600">
            Extraia texto de imagens e arquivos PDF usando inteligência artificial
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Section */}
            <Card className="p-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Selecionar Arquivo</h2>
                
                <div
                  className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                  <p className="text-gray-700 font-medium">
                    Clique para selecionar ou arraste um arquivo
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    PNG, JPG, PDF (máx. 10MB)
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,application/pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isExtracting}
                />

                {isExtracting && (
                  <div className="flex items-center justify-center gap-2 text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                    <span>Extraindo texto...</span>
                  </div>
                )}

                {selectedFileName && (
                  <div className="text-sm text-gray-600">
                    Arquivo: <span className="font-medium">{selectedFileName}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Text Area */}
            <Card className="p-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Texto Extraído</h2>
                
                <Textarea
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  placeholder="O texto extraído aparecerá aqui..."
                  className="min-h-64 font-mono text-sm"
                />

                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={handleCopyText}
                    disabled={!extractedText}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copiar
                  </Button>
                  <Button
                    onClick={handleDownloadText}
                    disabled={!extractedText}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Baixar
                  </Button>
                  <Button
                    onClick={handleClearText}
                    disabled={!extractedText}
                    variant="outline"
                    size="sm"
                  >
                    Limpar
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar - History */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Histórico</h2>
              
              {listQuery.isLoading ? (
                <div className="text-center text-gray-500">Carregando...</div>
              ) : listQuery.data && listQuery.data.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {listQuery.data.map((extraction) => (
                    <div
                      key={extraction.id}
                      className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {extraction.fileName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(extraction.createdAt).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteExtraction(extraction.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                          title="Deletar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 text-sm">
                  Nenhuma extração ainda
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
