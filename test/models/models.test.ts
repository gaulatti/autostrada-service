import * as models from 'src/models/cluster.model';
import * as junction from 'src/models/junction.model';
import * as performance from 'src/models/performance.model';
import * as platform from 'src/models/platform.model';
import * as project from 'src/models/project.model';
import * as provider from 'src/models/provider.model';
import * as url from 'src/models/url.model';

describe('models', () => {
  it('should export something from cluster.model', () => {
    expect(Object.keys(models).length).toBeGreaterThan(0);
  });
  it('should export something from junction.model', () => {
    expect(Object.keys(junction).length).toBeGreaterThan(0);
  });
  it('should export something from performance.model', () => {
    expect(Object.keys(performance).length).toBeGreaterThan(0);
  });
  it('should export something from platform.model', () => {
    expect(Object.keys(platform).length).toBeGreaterThan(0);
  });
  it('should export something from project.model', () => {
    expect(Object.keys(project).length).toBeGreaterThan(0);
  });
  it('should export something from provider.model', () => {
    expect(Object.keys(provider).length).toBeGreaterThan(0);
  });
  it('should export something from url.model', () => {
    expect(Object.keys(url).length).toBeGreaterThan(0);
  });
});
