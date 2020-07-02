module.exports = class Util {
   
    constructor(client){
        this.client = client;
        this.client.util = this;
        this.util = this;
    }
    async trimFromArray(array = [], maxLength = 10) {
        if(array.length > maxLength) {
            const len = array.length - maxLength;
            array = array.slice(0, maxLength);
            array.push(`\nAnd ${len} more items.....`);
        }
        return array;
    }
    
    
    
    
    async  formatDate(date, format){
        return new Date(date).toLocaleString(format);
    }
    
    async  getUserFromMention(mention, manager){
        const matches = mention.match(/^<@!?(\d+)>$/);
    
        if(!matches) return;
    
        const id = matches[1];
    
        return manager.cache.get(id);
    }
}





