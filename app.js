const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./src/config.json');
const fs = require('fs');
const moment = require('moment');
const chalk = require('chalk');
const welcome = require('./src/welcome');

moment.locale('pt-br');
const getTime = moment().format('LLL');
 
client.on('warn', console.warn);

client.on('error', console.error);

client.on('ready', async () =>{
	console.log(chalk.green(`[#Console - ${getTime}] > ${client.user.username} iniciado com sucesso!`));
	client.user.setActivity(`${config.prefix}rgb @user`);
});

client.on('guildMemberAdd', async member =>{
	console.log(chalk.yellow(`[#Console - ${getTime}] > ${member.user.username} entrou no servidor ${member.guild.name}!`));
});

client.on('guildMemberRemove', async member =>{
	console.log(chalk.yellow(`[#Console - ${getTime}] > ${member.user.username} saiu do servidor!`));
});

client.on('disconnect', async () =>{
	console.log(chalk.yellow(`[#Console - ${getTime}] > ${client.user.username} desconectado!`));
});

client.on('reconnecting', async () =>{
	console.log(chalk.green(`[#Console - ${getTime}] > ${client.user.username} conectado novamente!`));
});

client.on('message', message => {

	if (!message.content.startsWith(config.prefix) || message.author.bot) return;

	const args = message.content.slice(config.prefix.length).split(' ');
	const command = args.shift().toLowerCase();
	const user = message.author;
    let commandFile = require(`./src/commands/${command}.js`);

	try {
		console.log(chalk.yellow(`[#Console - ${getTime}] > ${user.username} usou o comando ${config.prefix}${command}!`));
		if (fs.existsSync(`./src/commands/${command}.js`)){
			commandFile.run(client, message, args);
		}else{
			console.log(chalk.yellow(`[#Console - ${getTime}] > O comando '${command}' não existe!`));
			//message.channel.send(`O comando '${command}' não existe!`);
		}
	} catch (e) {
		console.log(chalk.red(`[#Console - ${getTime}] > Erro: ${e.stack}`));
	}
});

client.login(config.token);