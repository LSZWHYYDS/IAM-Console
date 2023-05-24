/**
 * Created by xifeng on 2017/10/26.
 */
/*jshint esversion: 6 */

let appUtil = {
  /**
   * check if an Application be used as an trusted_peer app.
   * @param {application} app Application info
   */
  trustableNative(app) {
    return (
      app &&
      app.application_type &&
      ['native', 'trusted'].includes(app.application_type.toLowerCase())
    );
  },

  trustableWebSpa(app) {
    return app && app.application_type && ['trusted'].includes(app.application_type.toLowerCase());
  },

  isSyncData(appType) {
    return appType && ['spa', 'web', 'native', 'trusted', 'cli'].includes(appType.toLowerCase());
  },

  /**
   * check if a application_type can login with QR code.
   * @param {string} appType application type
   */
  canLoginWithQRCode(appType) {
    return appType && ['spa', 'web', 'trusted', 'trusted'].includes(appType.toLowerCase());
  },

  /**
   * check if a application_type can login with one-time password.
   * @param {string} appType application type
   */
  canLoginWithOneTimePwd(appType) {
    return appType && ['spa', 'web', 'native', 'trusted'].includes(appType.toLowerCase());
  },
  /**
   * check if a application_type can login with one-time password.
   * @param {string} appType application type
   */
  canLoginWithSecureLogin(appType) {
    return appType && ['spa', 'web', 'native', 'trusted'].includes(appType.toLowerCase());
  },

  /**
   * check if an application can have a redirect_uri
   * @param {string} appType application type
   */
  hasRedirectURI(appType) {
    return appType && ['native', 'web', 'spa'].includes(appType.toLowerCase());
  },

  hasClientSecret(appDetail) {
    return (
      appDetail &&
      (appDetail.client_secret ||
        (appDetail.application_type &&
          ['web', 'trusted', 'cli'].includes(appDetail.application_type.toLowerCase())))
    );
  },

  /**
   * does this application supports cli mode ?
   * for an CLI Application, which is always cli mode.
   * @param {string} appType
   */
  supportCliMode(appType) {
    return appType && 'cli' != appType.toLowerCase();
  },

  /**
   * check if an application can access offline. aka, can has a refresh_token
   * @param {string} appType  application type
   */
  canOfflineAccess(appType) {
    return appType && ['native', 'web', 'trusted'].includes(appType.toLowerCase());
  },

  /**
   * check if an application has an id_token
   * @param {string} appType  application type
   */
  hasIdToken(appType) {
    return appType && 'cli' !== appType;
  },

  /**
   * check if an application needs a constent prompt
   * @param {string} appType aplication type
   */
  needsConsentPrompt(appType) {
    return appType && ['native', 'spa', 'web'].includes(appType.toLowerCase());
  },

  /**
   * check if an application can be authorization delegated
   * @param {string} appType application type
   */
  canBeAuthorizationDelegated(appType) {
    return appType && ['native', 'spa', 'web'].includes(appType.toLowerCase());
  },

  /**
   * check if an application is for user use or machine use.
   * @param {string} appType application type
   */
  canBeUsedForUser(appType) {
    return appType && 'cli' !== appType.toLowerCase();
  },

  /**
   * check if application can use ext-attr for extra authentication factor.
   * @param {string} appType application type
   */
  canUseExtraAuthFactor(appType) {
    return appType && 'trusted' == appType;
  },

  /**
   * check if application can authenticate with certificcate
   * @param {string} appType application type
   */
  canAuthWithCert(appType) {
    return appType && 'trusted' == appType;
  },

  /**
   * check if an Application is enabled
   * @param {application} app Application info
   */
  isActive(app) {
    return app && app.status && app.status.toUpperCase() === 'ACTIVE';
  },

  isRoleEditable(role) {
    return !this.isSystemRole(role);
  },

  isSystemRole(role) {
    return role && role.create_mode && role.create_mode.toUpperCase() === 'BY_SYSTEM';
  },

  canBeUsedForQrcode(appType) {
    return appType && 'web' == appType.toLowerCase();
  },
};

export default appUtil;
