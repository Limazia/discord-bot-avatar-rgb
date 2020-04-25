const config = require('../config.json');
const { Attachment } = require('discord.js');
const moment = require('moment');
const fs = require('fs');
const jimp = require('jimp');
const chalk = require('chalk');
const getColors = require('get-image-colors');
const download = require('../lib/download');  

moment.locale('pt-br');
const getTime = moment().format('LLL');

exports.run = async (client, message, args) => {
  function getUserFromMention(mention) {
    const matches = mention.match(/^<@!?(\d+)>$/);
    if (!matches) return;
    const id = matches[1];

    return client.users.get(id);
  }

  if (!args.length) {
    return message.channel.send(`Use: ${config.prefix}rgb @user`);
  }

  async function getColor(uuid, avatar){
    await getColors(`./src/assets/avatars/${uuid}/avatar.png`, async function (err, colors) {
        if (err) throw err
        const hexcolor = colors.map(color => color.hex());
        for (var key in hexcolor) {
            var iWidth;  
            var iHeight;

            if(key == 0){
                iWidth = 302;
                iHeight = 79;
            }
            if(key == 1){
                iWidth = 302;
                iHeight = 46;
            }
            if(key == 2){
                iWidth = 302;
                iHeight = 79;
            }
            if(key == 3){
                iWidth = 302;
                iHeight = 63;
            }
            if(key == 4){
                iWidth = 302;
                iHeight = 45;
            }

            //console.log({ key: key, value: hexcolor[key] });  
            
            try {
                const replaceHashtag = hexcolor[key].replace('#', '♯');
                const removeHashtag = hexcolor[key].replace('#', '');
                const url = `https://dummyimage.com/${iWidth}x${iHeight}/${removeHashtag}/fff.png&text= `;
                download(encodeURI(url), `./src/assets/avatars/${uuid}/palette_${key}.png`, function(state){ 
                    console.log(chalk.green(`[#Console - ${getTime}] > Progresso:`, state));
                  }, function (response) {
                    console.log(chalk.green(`[#Console - ${getTime}] > Código de Status:`, response.statusCode));
                  }, function (error) {
                    console.log(chalk.red(`[#Console - ${getTime}] > Error:`, error));
                  }, function () {
                    console.log(chalk.green(`[#Console - ${getTime}] > Imagens baixadas com sucesso`));       
                })
            } catch (error){
                console.log(chalk.red(`[#Console - ${getTime}] > Erro: ${error}.`))
            }  
        }

        setTimeout(async function() {
            try {
                var images = [
                    './src/assets/images/grid.png',
                    `./src/assets/avatars/${uuid}/palette_0.png`,
                    `./src/assets/avatars/${uuid}/palette_1.png`,
                    `./src/assets/avatars/${uuid}/palette_2.png`,
                    `./src/assets/avatars/${uuid}/palette_3.png`,
                    `./src/assets/avatars/${uuid}/palette_4.png`,
                ];
            
                var jimps = [];

                for (var k = 0; k < images.length; k++) {
                    jimps.push(jimp.read(images[k]));
                }

                await Promise.all(jimps).then(function(data) {
                    return Promise.all(jimps);
                }).then(function(data) {
                    data[0].composite(data[1], 0, 0);
                    data[0].composite(data[2], 0, 75);
                    data[0].composite(data[3], 0, 121);
                    data[0].composite(data[4], 0, 200);
                    data[0].composite(data[5], 0, 260);
                
                    data[0].write(`./src/assets/avatars/${uuid}/palette_final.png`, function() {
                        console.log(chalk.green(`[#Console - ${getTime}] > Paleta final criada com sucesso`));
                    });
                });
            } catch (error) {
                console.log(chalk.red(`[#Console - ${getTime}] > Erro: ${error}.`))
            }
        }, 1500);

        var colorList = [
          "1752220", 
          "3066993", 
          "3447003", 
          "10181046", 
          "15844367", 
          "15105570", 
          "15158332", 
          "9807270", 
          "8359053", 
          "3426654", 
          "1146986", 
          "2067276", 
          "2123412", 
          "7419530", 
          "12745742", 
          "11027200", 
          "10038562", 
          "9936031", 
          "12370112", 
          "2899536", 
          "16580705", 
          "12320855"
        ]
        var colorRand = colorList[Math.floor(Math.random() * colorList.length)];

        setTimeout(async function() {
          let user = message.author;
          const attachment = new Attachment(`./src/assets/avatars/${uuid}/palette_final.png`);
          await message.channel.send(''+user+' ```- Cor 1: '+hexcolor[0]+'\n- Cor 2: '+hexcolor[1]+'\n- Cor 3: '+hexcolor[2]+'\n- Cor 4: '+hexcolor[3]+'\n- Cor 5: '+hexcolor[4]+'```', attachment);
        }, 2000);
      
    })
  }

  var sID;
  var sAvatar;

  if (args[0]) {
    const user = getUserFromMention(args[0]);
    if (user) {
        if (!fs.existsSync(`${config.AvatarsPath}/${user.id}/`)){
          fs.mkdirSync(`${config.AvatarsPath}/${user.id}/`);
        }
        await download(encodeURI(user.displayAvatarURL), `${config.AvatarsPath}/${user.id}/avatar.png`, function(state){ 
          console.log(chalk.green(`[#Console - ${getTime}] > Progresso:`, state));
        }, function (response) {
          console.log(chalk.green(`[#Console - ${getTime}] > Código de Status:`, response.statusCode));
        }, function (error) {
          console.log(chalk.red(`[#Console - ${getTime}] > Error:`, error));
        }, function () {
          console.log(chalk.green(`[#Console - ${getTime}] > Avatar baixado com sucesso`));   
      })

      setTimeout(function() {
        sID = user.id;
        sAvatar = user.displayAvatarURL;
        getColor(sID, sAvatar);
      }, 3000);
    }
  }

}