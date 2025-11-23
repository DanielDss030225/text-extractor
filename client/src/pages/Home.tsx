import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { FileText, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">{APP_TITLE}</h1>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                <span className="text-sm text-gray-600">Olá, {user.name}</span>
                <Button
                  onClick={() => logout()}
                  variant="outline"
                  size="sm"
                >
                  Sair
                </Button>
              </>
            ) : (
              <Button
                onClick={() => window.location.href = getLoginUrl()}
                size="sm"
              >
                Entrar
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
        {isAuthenticated ? (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Bem-vindo ao Text Extractor
              </h2>
              <p className="text-xl text-gray-600">
                Extraia texto de imagens e PDFs com inteligência artificial
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Múltiplos Formatos
                  </h3>
                  <p className="text-gray-600">
                    Suporte para PNG, JPG e PDF com até 10MB
                  </p>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🤖</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    IA Avançada
                  </h3>
                  <p className="text-gray-600">
                    Extração precisa com tecnologia de visão por IA
                  </p>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">💾</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Histórico
                  </h3>
                  <p className="text-gray-600">
                    Mantenha um histórico de todas as suas extrações
                  </p>
                </div>
              </Card>
            </div>

            {/* CTA Button */}
            <div className="text-center mt-12">
              <Button
                onClick={() => navigate("/extractor")}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
              >
                Começar a Extrair Texto
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Extraia Texto de Imagens e PDFs
              </h2>
              <p className="text-xl text-gray-600">
                Use inteligência artificial para extrair texto de forma rápida e precisa
              </p>
            </div>

            <Button
              onClick={() => window.location.href = getLoginUrl()}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
            >
              Entrar para Começar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
