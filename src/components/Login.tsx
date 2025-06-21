import React, { useState } from "react";

interface UsernameRegistrationProps {
  onUsernameSubmit: (username: string) => void;
}

const Login = ({ onUsernameSubmit }: UsernameRegistrationProps) => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    setTimeout(() => {
      onUsernameSubmit(username.trim());
      setIsLoading(false);
    }, 500);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md h-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            {/* <MessageCircle className="w-8 h-8 text-blue-600" /> */}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenido a Chatea
          </h1>
          <p className="text-gray-600">Elige un usuario para iniciar</p>
        </div>

        <section className="mt-5 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <div className="text-center pt-8 pb-4">
            <h2 className="text-xl text-gray-800">Entra a la conversación</h2>
            <p className="text-gray-600">
              Podrás volver a usar el mismo usuario o elegir uno nuevo
            </p>
          </div>
          <div>
            <form
              onSubmit={handleSubmit}
              className="space-y-6 p-5 flex flex-col items-center "
            >
              {/* <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /> */}
              <input
                type="text"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 flex w-full rounded-lg text-start h-12 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                maxLength={20}
                required
              />

              <button
                type="submit"
                disabled={!username.trim() || isLoading}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer rounded-lg text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Empezando...</span>
                  </div>
                ) : (
                  "Empieza a chatear"
                )}
              </button>
            </form>
          </div>
        </section>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Tu usuario será visible para los demas
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;
