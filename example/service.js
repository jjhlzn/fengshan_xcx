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
      this.host = "xcx.ningboxhw.com";
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

   checkProductUrl() {
     return `${this.http}://${this.host}${this.port}/checkproduct${this.prefix}`
   }

   checkOrderUrl() {
     return `${this.http}://${this.host}${this.port}/checkorder${this.prefix}`
   }

   getCheckOrdersUrl() {
     return `${this.http}://${this.host}${this.port}/getcheckorders${this.prefix}`
   }

   getNotCheckListUrl() {
     return `${this.http}://${this.host}${this.port}/getnotchecklist${this.prefix}`
   }

   getCheckListUrl() {
     return `${this.http}://${this.host}${this.port}/getchecklist${this.prefix}`
   }

   getCheckItemUrl() {
     return `${this.http}://${this.host}${this.port}/getcheckitem${this.prefix}`
   }

   getCheckFileUrl() {
     return `${this.http}://${this.host}${this.port}/getcheckfile${this.prefix}`
   }

   getCheckImagesUrl() {
     return `${this.http}://${this.host}${this.port}/getcheckimages${this.prefix}`
   }

   getCheckImageUrl(filename) {
     return `${this.http}://${this.host}${this.port}/uploads/${filename}`
   }

   getCheckItemResultUrl() {
     return `${this.http}://${this.host}${this.port}/getcheckitemresult${this.prefix}`
   }

   getAllCheckersUrl() {
     return `${this.http}://${this.host}${this.port}/getallcheckers${this.prefix}`
   }

   assignCheckerUrl() {
     return `${this.http}://${this.host}${this.port}/assignchecker${this.prefix}`
   }

   getCheckOrderContractsUrl() {
     return `${this.http}://${this.host}${this.port}/getcheckordercontracts${this.prefix}`
   }

   getContractInfoUrl() {
     return `${this.http}://${this.host}${this.port}/getcontractinfo${this.prefix}`
   }

   getProductInfoUrl() {
     return `${this.http}://${this.host}${this.port}/getproductinfo${this.prefix}`
   }

   getProductsUrl() {
     return `${this.http}://${this.host}${this.port}/getproducts${this.prefix}`
   }

   getCheckOrderInfoUrl() {
     return `${this.http}://${this.host}${this.port}/getcheckorderinfo${this.prefix}`
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
