import { VortexjsPage } from './app.po';

describe('vortexjs App', function() {
  let page: VortexjsPage;

  beforeEach(() => {
    page = new VortexjsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
