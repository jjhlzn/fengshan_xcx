class Service {
  constructor() {
   this.isTest = true;
   this.isLocal = false;
   if (this.isLocal) {
     this.http = "http";
     this.host = "localhost";
     this.port = ":16623";
     this.prefix = '.aspx';
   } else { 
    if (this.isTest) {
      this.http = "https";
      this.host = "xhw.hengdianworld.com";
      this.port = "";
      this.prefix = '.aspx'
    } else {
      this.http = "http";
      this.host = "10.211.55.3";
      this.port = ":80";
      this.prefix = '.aspx'
    } 
   }
    
  }
   loginUrl() {
     return `${this.http}://${this.host}${this.port}/login${this.prefix}`
   }

   uploadFileUrl() {
     return `${this.http}://${this.host}${this.port}/upload${this.prefix}`
   }

   getOrdersUrl() {
     return `${this.http}://${this.host}${this.port}/getorders${this.prefix}`
   }

   getOrderInfoUrl() {
     return `${this.http}://${this.host}${this.port}/getorderinfo${this.prefix}`
   }

   newOrderUrl() {
     return `${this.http}://${this.host}${this.port}/neworder${this.prefix}`
   }

   deleteOrderUrl() {
     return `${this.http}://${this.host}${this.port}/deleteorder${this.prefix}`
   }

   deleteOrderImageUrl() {
     return `${this.http}://${this.host}${this.port}/deleteorderimage${this.prefix}`
   }

   getOrderImageUrl(filename) {
     return `${this.http}://${this.host}${this.port}/uploads/${filename}`
   }

   setFlowStatusUrl() {
     return `${this.http}://${this.host}${this.port}/setflowstatus${this.prefix}`
   }

   getReportUrl() {
     return `${this.http}://${this.host}${this.port}/report${this.prefix}`
   }

   makeImageUrl(item) {
     console.log("makeImageUrl, item: " + item)
     if (item.fileName)
      return `${this.http}://${this.host}${this.port}/uploads/${item.fileName}`
    else 
       return `${this.http}://${this.host}${this.port}/uploads/${item}`
  }
}


module.exports = {
  Service: new Service()
}
