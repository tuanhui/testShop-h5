import { HuaDaPage } from './app.po';

describe('hua-da App', () => {
  let page: HuaDaPage;

  beforeEach(() => {
    page = new HuaDaPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
