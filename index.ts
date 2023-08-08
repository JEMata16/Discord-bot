/**  Nombres posibles: 
 * 
 * Tilinator 
 * 
*/

const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const { YTSearcher } = require('ytsearcher');

const prefix = '*';
const token = 'Yadcfeea17059ee1ed83341dac6f2892e6fc3f669dac18900698262038e5821ac';

const client = new Discord.Client();
const searcher = new YTSearcher({
  key: 'AIzaSyAS6CTIRDArRvHx1bxUcKrw_yGpmh5bt08',
});

client.once('ready', () => {
  console.log('Bot ready');
});

client.on('message', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();

  switch (command) {
    case 'play':
      execute(message, args);
      break;
    case 'skip':
      skip(message);
      break;
    case 'stop':
      stop(message);
      break;
    default:
      message.channel.send('Ese comando no se puede.');
      break;
  }
});

async function execute(message, args) {
  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) return message.channel.send('Metete en un canal de voz pelotudo/pelotuda.');

  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
    return message.channel.send('Necesito los permisos de blanco para hablar y conectarme.');
  }

  try {
    const video = await searcher.search(args.join(' '), { type: 'video' });
    const connection = await voiceChannel.join();
    const stream = ytdl(video.first.url, { filter: 'audioonly' });

    const dispatcher = connection.play(stream, { seek: 0, volume: 1 });
    dispatcher.on('finish', () => {
      voiceChannel.leave();
    });

    message.channel.send(`En la radio suena: ${video.first.title}`);
  } catch (error) {
    console.error(error);
    message.channel.send('Error tratando de poner la musica T_T.');
  }
}

function skip(message) {
  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) return message.channel.send('Necesito estar en un canal para saltar la música AAA.');

  voiceChannel.leave();
}

function stop(message) {
  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) return message.channel.send('Necesito estar en un canal para parar la música AAA.');

  voiceChannel.leave();
}

client.login(token);
