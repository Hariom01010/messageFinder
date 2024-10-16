const { Client, IntentsBitField, TextChannel, ChannelType, MessageType } = require("discord.js");
const dotenv = require("dotenv");

dotenv.config();

const client = new Client({intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent]});

// helper function to find all the messages in a channel
const fetchMessages = async (channel)=>{
    let messages = []
    let lastId = null;
    let fetchedMessages;

    do{
        fetchedMessages = await channel.messages.fetch({limit: 100, before: lastId});
        messages = messages.concat(Array.from(fetchedMessages.values()));
        lastId = fetchMessages.size > 0? fetchedMessages.last().id: null;
    }while(fetchedMessages.size != 0)

}


client.on('ready', (c)=>{
    console.log(` ✅ ${c.user.username} is ready to use`)
})

client.on('messageCreate', (message)=>{
    if(message.author.bot){
        return;
    }
    message.reply(`hello ${message.author.username}`)
})

client.on('interactionCreate',async interaction =>{
    if(interaction.isChatInputCommand()) {
        if(interaction.commandName === 'findmessage'){
            const word = interaction.options._hoistedOptions[0].value
            const limit = interaction.options._hoistedOptions[1].value

            // get the cache of all the channels the bot has access to
            const channels = client.channels.cache
            
            // adds the text channels to textChannels (type = 0 for text channels)
            const messages = []
            for(const [key, value] of channels){
                // console.log(`${key} is of ${value.type}`)
                console.log(value.type == ChannelType.GuildText)
                if(value.type == ChannelType.GuildText){
                   try{
                    const fetchedMessages = await value.messages.fetch({limit:50})
                    for(const [msgID, msgValue] of fetchedMessages){
                        if(msgValue.type == MessageType.Default || msgValue.type == MessageType.Reply){
                            if(msgValue.content.includes(word)){
                                if(msgValue.content.length > limit){
                                    const msgContent = msgValue.content
                                    const msgLink = `https://discord.com/channels/${msgValue.guildId}/${msgValue.channelId}/${msgID}`
                                    messages.push({msgID, msgContent, msgLink})
                                }
                            }
                        }
                    }
                   }catch(error){
                    console.log(`[WARNING] An error occured: ${error}`)
                   }
                }
            }     
            
            const msgString = messages.map(msg=>{
                return `**msgId**: ${msg.msgID} \n **msgContent**: ${msg.msgContent} \n **msgLink**: ${msg.msgLink} \n`
            }).join('\n')

            console.log(`keyword is: ${word} and limit is: ${limit}`)
            console.log(messages)
            interaction.reply(`**Searching for keyword: ${word} and limit: ${limit}:** \n\n ${msgString}`)
        } 
    }
})
client.login(process.env.BOT_TOKEN)