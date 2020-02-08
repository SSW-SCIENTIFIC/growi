import { Container } from 'unstated';

import loggerFactory from '@alias/logger';
import { pathUtils } from 'growi-commons';

import urljoin from 'url-join';

// eslint-disable-next-line no-unused-vars
const logger = loggerFactory('growi:security:AdminTwitterSecurityContainer');

/**
 * Service container for admin security page (TwitterSecurityManagement.jsx)
 * @extends {Container} unstated Container
 */
export default class AdminTwitterSecurityContainer extends Container {

  constructor(appContainer) {
    super();

    this.appContainer = appContainer;

    this.state = {
      callbackUrl: urljoin(pathUtils.removeTrailingSlash(appContainer.config.crowi.url), '/passport/twitter/callback'),
      twitterConsumerKey: '',
      twitterConsumerSecret: '',
      isSameUsernameTreatedAsIdenticalUser: false,
    };

    this.updateTwitterSetting = this.updateTwitterSetting.bind(this);
  }

  /**
   * retrieve security data
   */
  async retrieveSecurityData() {
    const response = await this.appContainer.apiv3.get('/security-setting/');
    const { twitterOAuth } = response.data.securityParams;
    this.setState({
      twitterConsumerKey: twitterOAuth.twitterConsumerKey,
      twitterConsumerSecret: twitterOAuth.twitterConsumerSecret,
      isSameUsernameTreatedAsIdenticalUser: twitterOAuth.isSameUsernameTreatedAsIdenticalUser,
    });
  }

  /**
   * Workaround for the mangling in production build to break constructor.name
   */
  static getClassName() {
    return 'AdminTwitterSecurityContainer';
  }

  /**
   * Change twitterConsumerKey
   */
  changeTwitterConsumerKey(value) {
    this.setState({ twitterConsumerKey: value });
  }

  /**
   * Change twitterConsumerSecret
   */
  changeTwitterConsumerSecret(value) {
    this.setState({ twitterConsumerSecret: value });
  }

  /**
   * Switch isSameUsernameTreatedAsIdenticalUser
   */
  switchIsSameUsernameTreatedAsIdenticalUser() {
    this.setState({ isSameUsernameTreatedAsIdenticalUser: !this.state.isSameUsernameTreatedAsIdenticalUser });
  }

  /**
   * Update twitterSetting
   */
  async updateTwitterSetting() {
    const { twitterConsumerKey, twitterConsumerSecret, isSameUsernameTreatedAsIdenticalUser } = this.state;

    const requestParams = {
      twitterConsumerKey,
      twitterConsumerSecret,
      isSameUsernameTreatedAsIdenticalUser,
    };

    for (const [key, value] of Object.entries(requestParams)) {
      if (value == null) { delete requestParams[key] }
    }

    const response = await this.appContainer.apiv3.put('/security-setting/twitter-oauth', requestParams);

    const { securitySettingParams } = response.data;

    this.setState({
      twitterConsumerKey: securitySettingParams.twitterConsumerKey,
      twitterConsumerSecret: securitySettingParams.twitterConsumerSecret,
      isSameUsernameTreatedAsIdenticalUser: securitySettingParams.isSameUsernameTreatedAsIdenticalUser,
    });
    return response;
  }

}
