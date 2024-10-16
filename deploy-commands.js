const {REST, Routes, ApplicationCommandOptionType} = require('discord.js')
const dotenv = require('dotenv')

dotenv.config()

const commands = [
    {
        name: 'hey',
        description: 'Replies with hey'
    },
    {
        name: 'ping',
        description: 'Replies with pong'
    },
    {
        name: 'findmessage',
        description: 'Finds all the messages with the given word',
        options: [
            {
                name: 'search-keyword',
                description: 'The keyword we want to look for in the message',
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: 'limit',
                description: 'The minimum word limit for the message',
                type: ApplicationCommandOptionType.Number,
                required: true
            }
        ]
    }
]

const rest = new REST().setToken(process.env.BOT_TOKEN);

(async ()=>{
    try{
        console.log('Registering Slash Commands')

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            {body: commands}
        )

        console.log('Slash Commands were registered succesfully')
    }catch(error){
        console.log(`There was an error: ${error}`)
    }
})();