import { TestWebPage } from './app.po';

describe('test-web App', () => {
  let page: TestWebPage;

  beforeEach(() => {
    page = new TestWebPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
