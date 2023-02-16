import isNil from 'lodash.isnil';
import HttpError from 'http-errors';
import ConsoleClient from './console-client';
import upperFirst from 'lodash.upperfirst';
import camelCase from 'lodash.camelcase';
import { Page } from '@tinystacks/ops-model';
import { ConsoleParser, PageParser } from '@tinystacks/ops-core';

const PageClient = {
  handleError (error: unknown): never {
    if (HttpError.isHttpError(error)) {
      if (error.message.includes('CONFIG_PATH') || error.message.includes('Config file')) {
        error.message = error.message?.replaceAll('console', 'page');
      }
    }
    throw error;
  },
  async getPage (consoleName: string, pageId: string): Promise<PageParser> { //should return a pageParser
    try {
      const console : ConsoleParser = await ConsoleClient.getConsole(consoleName);
      const existingPage = console.pages[pageId];
      if (!existingPage) throw HttpError.NotFound(`Page with id ${pageId} does not exist in console ${consoleName}!`);
      return existingPage;
    } catch (error) {
      return this.handleError(error);
    }
  },
  async getPages (consoleName: string): Promise<PageParser[]> {
    try {
      const console = await ConsoleClient.getConsole(consoleName);
      return Object.values(console.pages);
    } catch (error) {
      return this.handleError(error);
    }
  },
  async createPage (consoleName: string, page: Page): Promise<PageParser> {
    try {
      const console = await ConsoleClient.getConsole(consoleName);
      const routeId = upperFirst(camelCase(page.route));
      const pageId = page.id || routeId;
      page.id = pageId;
      const existingPage = console.pages[pageId];
      const existingPageWithRoute = Object.values(console.pages).find(p => p.route === page.route);
      if (existingPage) throw HttpError.Conflict(`Cannot create new page with id ${pageId} because a page with this id already exists on console ${consoleName}!`);
      if (existingPageWithRoute) throw HttpError.Conflict(`Cannot create new page with route ${page.route} because a page with this route already exists on console ${consoleName}!`);
      console.addPage(page, pageId);
      await ConsoleClient.saveConsole(console.name, console);
      return this.getPage(consoleName, page.id);
    } catch (error) {
      return this.handleError(error);
    }
  },
  async updatePage (consoleName: string, pageId: string, page: Page): Promise<PageParser> {
    try {
      const console: ConsoleParser = await ConsoleClient.getConsole(consoleName);
      const existingPage = console.pages[pageId];
      if (isNil(existingPage)) throw HttpError.NotFound(`Cannot update page with id ${pageId} because this page does not exist on console ${consoleName}!`);
      // No trickery allowed.
      page.id = pageId;
      console.updatePage(page, pageId);
      await ConsoleClient.saveConsole(console.name, console);
      return this.getPage(consoleName, page.id);
    } catch (error) {
      return this.handleError(error);
    }
  },
  async deletePage (consoleName: string, pageId: string): Promise<PageParser> {
    try {
      const console = await ConsoleClient.getConsole(consoleName);
      const existingPage = console.pages[pageId];
      if (isNil(existingPage)) throw HttpError.NotFound(`Cannot delete page with id ${pageId} because this page does not exist on console ${consoleName}!`);
      console.deletePage(pageId);
      await ConsoleClient.saveConsole(console.name, console);
      return existingPage;
    } catch (error) {
      return this.handleError(error);
    }
  }
};

export default PageClient;