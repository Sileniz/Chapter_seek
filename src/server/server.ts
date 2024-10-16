import * as cheerio from 'cheerio';
import fs from 'fs'
import path from 'path';
import { Telegraf } from 'telegraf';
import('node-fetch')
import 'dotenv/config'

interface ChapterInterface {
    manga: string;
    chapter: number; 
    link: string;
}
class Server{   
    private filePath: string
    private bot: Telegraf
    private chatID: string

    constructor(){
        if(!process.env.API_TELEGRAM) throw new Error("Token invalido")
        if(!process.env.CHAT_ID) throw new Error("Chat ID invalido")
        this.chatID = process.env.CHAT_ID
        this.bot = new Telegraf(process.env.API_TELEGRAM)
        this.filePath = path.join(__dirname, 'chapters.json')
        this.bot.launch();
        this.bot.command('checkUpdate', () => this.checkFile('checkUpdate')); 
    }
    public async checkFile(command: string | null): Promise<void> {
        fs.readFile(this.filePath, 'utf-8', async (err, data ) => {
            if(err){
                console.log(err)
                return
            }
            let info = JSON.parse(data)
            if(info){
                await Promise.all(info.map((infoItem: any) => 
                    this.initCheck(infoItem.manga, infoItem.chapter, infoItem.link, command)
                ))
            }
        })
    }
    private async updateFiles(data: string, manga: string, chapter: string): Promise<void> {
        let jsonChapter = JSON.parse(data)
        let findChapter = jsonChapter.find((e: ChapterInterface) => e.manga == manga)
            if(findChapter){
                findChapter.chapter = chapter
            }
        fs.writeFile(this.filePath, JSON.stringify(jsonChapter), (err) => {
            if(err){
                console.log(err)
                throw Error('Falha ao ler arquivo')
            }
        })
    }
    private async commandsMessage(command: string, manga: string): Promise<void> {
        if(command == 'checkUpdate'){
            await this.bot.telegram.sendMessage(this.chatID, `Sem capítulos novo: ${manga}`)
            console.log(`Sem capítulos novo: ${manga}`)
        }
    }
    private async initCheck(manga: string, chapter: string, link: string, command: string | null): Promise<void> {
        try {
            const data = await fetch(link)
            if (!data.ok) {
                console.error("Falha ao buscar dados.")
                return
            }
    
            const html = await data.text()
            const $ = cheerio.load(html)
            const nextDataScript = $('script#__NEXT_DATA__').html()
    
            if (!nextDataScript) {
                await this.bot.telegram.sendMessage(this.chatID, "Título não encontrado")
                console.log("Título não encontrado")
                return
            }
    
            const nextDataJson = JSON.parse(nextDataScript);
            const { comic } = nextDataJson.props?.pageProps || {}
    
            if (!comic || manga !== comic.title) {
                await this.bot.telegram.sendMessage(this.chatID, `Há um título inconsistente na base de dados: ${manga}`)
                console.log(`Há um título inconsistente na base de dados: ${manga}`)
                return
            }
    
            const lastChapter = parseInt(comic.last_chapter)
            if (parseInt(chapter) < lastChapter) {
                console.log(`Novo capítulo lançado: ${manga}`)
                await this.bot.telegram.sendMessage(this.chatID, `Novo capítulo lançado: ${manga}`)
    
                fs.readFile(this.filePath, 'utf8', (err, data) => {
                    if (err) {
                        console.error("Erro ao ler arquivo:", err)
                        return
                    }
                    this.updateFiles(data, manga, comic.last_chapter)
                })
            } else {
                command ? this.commandsMessage(command, manga) : []
            }
        } catch (error) {
            console.error("Erro durante a verificação:", error)
        }
    }
}
const interval = 10 * 60 * 1000
const server = new Server().checkFile(null)
//setInterval(() => server.checkFile(), 600000) Codigo com intervalo pra ser executado durante um periodo de tempo