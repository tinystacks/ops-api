import { Page as PageType } from '@tinystacks/ops-model';
import PageClient from '../clients/page-client';
import { PageParser } from '@tinystacks/ops-core';

const PageController = {
  async getPages (consoleName: string): Promise<PageType[]> {
    const pages : PageParser[] = await PageClient.getPages(consoleName);
    const pageTypes: PageType[] = pages.map( (page) => { 
      return page.toJson();
    }); 
    return pageTypes;
  },
  async postPage (consoleName: string, createPageBody: PageType): Promise<PageType> {
    const page: PageParser = PageParser.fromJson(createPageBody);
    return ( await PageClient.createPage(consoleName, page)).toJson();
  },
  async putPage (consoleName: string, pageId: string, updatePageBody: PageType): Promise<PageType> {
    const page: PageParser = PageParser.fromJson(updatePageBody);
    page.route = pageId;
    return (await PageClient.updatePage(consoleName, pageId, page)).toJson();
  },
  async deletePage (consoleName: string, pageId: string): Promise<PageType> {
    return (await PageClient.deletePage(consoleName, pageId)).toJson();
  }
};

export default PageController;