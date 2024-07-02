/**
 * node index.js - faz com que rode seu servidor
 * inicializar o projeto - npm init -y
 * package nodemon - npm i nodemon -D
 * 
 * no arquivo package.json no scripts, precisamos definer como "dev": "nodemon index.js" 
 * para que seja executado o aruivo nodemon do projeto.
 * 
 * com o npm run dev, fará com que seja rodado o script.
 */

const http = require("http"); //importa o módulo http.
const {randomUUID} = require("crypto"); // utiliza a função dentro do módulo crypto que faz id aleatórios

/**
 * GET - Busca um dado;
 * POST - Inserir um dado;
 * PUT - Alterar um dado;
 * DELETE - Remover um dado;
 */

const users = [];
// criando o servidor.
const server = http.createServer((request, response) =>{
    
    // fazendo a verificação da url, se ela for igual a barra users para tudo que for relacionado ao usuário.
    if(request.url === "/users"){

        // se o request for igual ao método GET.
        if(request.method === "GET"){
            // pode-se definir o que deseja retornar assim que encontrar a url.
            return response.end(JSON.stringify(users));
        }

        // se o request for igual ao método POST
        if(request.method === "POST"){
            // o request aqui irá funcionar como um stream.
            // o data é toda a informação que está vindo da requisição.
            request.on("data", (data) => {
                const dataUser = JSON.parse(data);

                // definindo um user, que vai receber um id random.
                const user = {
                    id: randomUUID(),
                    ...dataUser,
                };

                users.push(user);
            })
            .on("end", () => {
                return response.end(JSON.stringify(users));
            }) // stringify pega tudo que estiver passando para ele e ele converte como string.
        }
    }

    if(request.url.startsWith("/users")){
        // busca o método para alterar o usuário.
        if(request.method === "PUT"){
            // pega a url a ser usada.
            const url = request.url;
            // separa a url pela barra.
            const splitURL = url.split("/")
            // pega somente o id.
            const idUser = splitURL[2];
            // precorre o array, para encontra a posição do usuário que tem o id.
            const userIndex = users.findIndex(user => user.id === idUser);


            request.on("data", (data) => {
                const dataUser = JSON.parse(data);

                //altera o usuário na posição do array encontrado.
                users[userIndex] = {
                    id: idUser,
                    ...dataUser,
                }
            }).on("end", () => {
                return response.end(JSON.stringify(users));
            });
        }
    }
});

// a .listen é a que faz subir o servidor, primiero define-se a porta que quer subir a aplicação.
server.listen(4000, () => console.log("Server is running on PORT 4000"));