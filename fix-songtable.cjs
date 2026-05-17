const fs = require('fs');
let content = fs.readFileSync('src/components/music/SongTable.vue', 'utf8');

// Add play button overlay on album art
const oldImg = `<img :src="song.al?.picUrl || 'https://picsum.photos/50?random=' + song.id"
                class="w-10 h-10 rounded object-cover">`;

const newImg = `<div class="relative w-10 h-10 flex-shrink-0">
                <img :src="song.al?.picUrl || 'https://picsum.photos/50?random=' + song.id"
                  class="w-10 h-10 rounded object-cover">
                <div class="absolute inset-0 bg-black/40 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  @click="$emit('play', song, startIndex + index)">
                  <i class="fas fa-play text-white text-xs"></i>
                </div>
              </div>`;

content = content.replace(oldImg, newImg);
fs.writeFileSync('src/components/music/SongTable.vue', content, 'utf8');
console.log('Done');
