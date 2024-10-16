# Chapter Seek


## Descrição

Chapter Seek é um serviço em Node.js desenvolvido com TypeScript que realiza **web scraping** no site da comick para monitorar novos capítulos. Quando um novo capítulo é detectado, o serviço envia notificações automáticas para um canal ou grupo no **Telegram**, utilizando a API do Telegram.


## Funcionalidades

- Monitoramento contínuo de sites de mangás para detectar novos capítulos.
- Envio de notificações instantâneas para canais ou grupos do Telegram.
- Integração com a API do Telegram para mensagens automatizadas.
- Implementado em **TypeScript** para maior segurança e escalabilidade.
- Facilidade de personalização através de arquivos de configuração.
## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript no servidor.
- **TypeScript**: Superset de JavaScript que adiciona tipagem estática.
- **Telegraf**: Biblioteca para integração com a API do Telegram.
- **Cheerio**: Ferramenta para realizar web scraping com HTML, semelhante ao jQuery.
- **dotenv**: Carrega variáveis de ambiente a partir de um arquivo `.env`.

## Requisitos

- **Node.js** (versão 18+)
- **npm** ou **yarn** para gerenciamento de pacotes
- Um bot do Telegram com **API Key**
- Um **Chat ID** do Telegram (grupo ou canal) onde as notificações serão enviadas

## Instalação

1. Clone este repositório:

   ```bash
   git clone https://github.com/Sileniz/Chapter_seek.git
2. Navegue até a pasta:
    ```bash
    cd Chapter_seek
3. Instale as dependências::
    ```bash
    npm install
4. Crie um arquivo .env na raiz do projeto e adicione as seguintes variáveis:
    ```bash
    API_TELEGRAM=seu-token-telegram
    CHAT_ID=seu-chat-id
<span></span>
- **API_TELEGRAM**: O token do seu bot do Telegram, que pode ser gerado através do BotFather.
- **CHAT_ID**: O ID do grupo ou canal onde as notificações serão enviadas. Você pode obter o Chat ID utilizando o bot @userinfobot no Telegram.

## Uso
1. Criar arquivo chapters.json
    ```bash
    [
    {
        "manga": "The Greatest Estate Developer",
        "chapter": 
        "link": "https://comick.io/comic/04-the-greatest-estate-developer"
    }
    ]
- **manga**: O nome do mangá.
- **chapter**: O último capítulo registrado.
- **link**: O link para a página do mangá a ser monitorado.

2. Para iniciar o serviço em modo de desenvolvimento, execute:
    ```bash
    npm run dev
<span></span>
Agora ele monitorara automaticamente o arquivo e avisara quando tiver capitulo novo e também atualizara o arquivo com o novo capítulo.