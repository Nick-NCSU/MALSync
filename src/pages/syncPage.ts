import {pages} from "./pages";
import {pageInterface, pageState} from "./pageInterface";
import {mal} from "./../utils/mal";

export class syncPage{
  page: pageInterface;

  constructor(public url){
    this.page = this.getPage(url);
    if (this.page == null) {
      throw new Error('Page could not be recognized');
    }
    var tempThis = this;
    $(document).ready(function(){tempThis.handlePage()});
  }

  private getPage(url){
    for (var key in pages) {
      var page = pages[key];
      if( url.indexOf(utils.urlPart(page.domain, 2).split('.').slice(-2, -1)[0] +'.') > -1 ){
        return page;
      }
    }
    return null;
  }

  handlePage(){
    var state: pageState;

    if(this.page.isSyncPage(this.url)){
      state = {
        title: this.page.sync.getTitle(this.url),
        identifier: this.page.sync.getIdentifier(this.url)
      };
      state.episode = this.page.sync.getEpisode(this.url);
      if (typeof(this.page.sync.getVolume) != "undefined"){
        state.volume = this.page.sync.getVolume(this.url)
      }
      con.log('Sync', state);
    }else{
      if (typeof(this.page.overview) == "undefined"){
        con.log('No overview definition');
        return;
      }
      state = {
        title: this.page.overview.getTitle(this.url),
        identifier: this.page.overview.getIdentifier(this.url)
      };
      con.log('Overview', state);
    }

    utils.getMalUrl(state.identifier, state.title, this.page.type, "Kissanime")
      .then((malUrl) => {
        if(malUrl === null){
          con.error('Not on mal');
        }else if(!malUrl){
          con.error('Nothing found');
        }else{
          con.log('MyAnimeList', malUrl);
          var malObj = new mal(malUrl);

          //TEMP//
          setTimeout(function(){
            con.info(malObj.getEpisode());
            con.info(malObj.setEpisode(10));
            con.info(malObj.getEpisode());
            con.info('--------------------------');
            con.info(malObj.getStatus());
            con.info(malObj.setStatus(1));
            con.info(malObj.getStatus());
            con.info('--------------------------');
            con.info(malObj.getScore());
            con.info(malObj.setScore(5));
            con.info(malObj.getScore());
            con.info('--------------------------');
            con.info(malObj.sync());
          },3000)
          //TEMP//
        }
      });
  }

}

