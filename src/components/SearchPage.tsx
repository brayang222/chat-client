import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatSvg } from "./icons/ChatSvg";
import { UserSvg } from "./icons/UserSvg";
import { SearchSvg } from "./icons/SearchSvg";
import { getUsers } from "../services/users/getUsers";

export const SearchPage = ({ username }: { username: string }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const navigate = useNavigate();

  async function fetchUsers() {
    try {
      const usersFetched = await getUsers();
      setUsers(usersFetched);
      return usersFetched;
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim()) {
      setIsSearching(true);
      console.log(users);
      const results = users
        .map((user) => user.username)
        .filter(
          (user) =>
            user.toLowerCase().includes(query.toLowerCase()) &&
            user !== username.toLowerCase()
        );
      setSearchResults(results);
      setIsSearching(false);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  const handleUserSelect = (selectedUser: string) => {
    console.log("Navigating to chat with:", selectedUser);
    navigate(`/chat/${selectedUser}`);
  };

  return (
    <div className="min-h-screen flex items-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-4xl mx-auto">
        <div className="shadow-lg border-0 bg-white/80 backdrop-blur-sm rounded-lg">
          <div className="border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
            <h1 className="flex items-center space-x-2 text-xl font-semibold">
              <ChatSvg classNames="w-6 h-6" />
              <span>Chatea</span>
              <span className="ml-auto text-sm font-normal">
                Bienvenido, {username}!
              </span>
            </h1>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <div className="relative">
                <SearchSvg />
                <input
                  type="text"
                  placeholder="Busca usuarios para chatear"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 h-12 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 flex w-full rounded-md bg-background px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {searchQuery && (searchResults.length > 0 || isSearching) && (
                <div className="mt-2 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mx-auto mb-2"></div>
                      Buscando...
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((user) => (
                      <div
                        key={user}
                        onClick={() => handleUserSelect(user)}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-center space-x-3"
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <UserSvg />
                        </div>
                        <span className="text-gray-800 font-medium">
                          {user}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No se encontraron resultados "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="text-center py-8">
              <ChatSvg classNames="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Busca a alguien para chatear
              </h3>
              <p className="text-gray-600">
                Busca a usuarios arriba para iniciar una conversación
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
