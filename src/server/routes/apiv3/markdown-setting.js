const loggerFactory = require('@alias/logger');

// eslint-disable-next-line no-unused-vars
const logger = loggerFactory('growi:routes:apiv3:user-group');

const express = require('express');

const router = express.Router();

const { body } = require('express-validator/check');

const ErrorV3 = require('../../models/vo/error-apiv3');

const validator = {
  lineBreak: [
    body('isEnabledLinebreaks').isBoolean(),
    body('isEnabledLinebreaksInComments').isBoolean(),
  ],
  presentationSetting: [
    body('pageBreakSeparator').isInt().not().isEmpty(),
  ],
  xssSetting: [
    body('isEnabledXss').isBoolean(),
    body('tagWhiteList').isArray(),
    body('attrWhiteList').isArray(),
  ],
};


/**
 * @swagger
 *  tags:
 *    name: MarkDownSetting
 */

module.exports = (crowi) => {
  const loginRequiredStrictly = require('../../middleware/login-required')(crowi);
  const adminRequired = require('../../middleware/admin-required')(crowi);
  const csrf = require('../../middleware/csrf')(crowi);

  // const {
  //   Config,
  // } = crowi.models;

  const { ApiV3FormValidator } = crowi.middlewares;

  /**
   * @swagger
   *
   *    /markdown-setting/lineBreak:
   *      put:
   *        tags: [MarkDownSetting]
   *        description: Update lineBreak setting
   *        requestBody:
   *          required: true
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  isEnabledLinebreaks:
   *                    description: enable lineBreak
   *                    type: boolean
   *                  isEnabledLinebreaksInComments:
   *                    description: enable lineBreak in comment
   *                    type: boolean
   *        responses:
   *          200:
   *            description: Succeeded to update lineBreak setting
   */
  router.put('/lineBreak', loginRequiredStrictly, adminRequired, csrf, validator.lineBreak, ApiV3FormValidator, async(req, res) => {

    const lineBreakParams = {
      'markdown:isEnabledLinebreaks': req.body.isEnabledLinebreaks,
      'markdown:isEnabledLinebreaksInComments': req.body.isEnabledLinebreaksInComments,
    };

    try {
      await crowi.configManager.updateConfigsInTheSameNamespace('markdown', lineBreakParams);
      return res.apiv3({ lineBreakParams });
    }
    catch (err) {
      const msg = 'Error occurred in updating lineBreak';
      logger.error('Error', err);
      return res.apiv3Err(new ErrorV3(msg, 'update-lineBreak-failed'));
    }

  });

  /**
   * @swagger
   *
   *    /markdown-setting/presentation:
   *      put:
   *        tags: [MarkDownSetting]
   *        description: Update presentation
   *        requestBody:
   *          required: true
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  pageBreakSeparator:
   *                    description: number of pageBreakSeparator
   *                    type: number
   *                  pageBreakCustomSeparator:
   *                    description: string of pageBreakCustomSeparator
   *                    type: string
   *        responses:
   *          200:
   *            description: Succeeded to update presentation setting
   */
  router.put('/presentation', loginRequiredStrictly, adminRequired, csrf, validator.presentationSetting, ApiV3FormValidator, async(req, res) => {
    if (req.body.pageBreakSeparator === 3 && req.body.pageBreakCustomSeparator === '') {
      return res.apiv3Err(new ErrorV3('customRegularExpression is required'));
    }

    const presentationParams = {
      'markdown:presentation:pageBreakSeparator': req.body.pageBreakSeparator,
      'markdown:presentation:pageBreakCustomSeparator': req.body.pageBreakCustomSeparator,
    };

    try {
      await crowi.configManager.updateConfigsInTheSameNamespace('markdown', presentationParams);
      return res.apiv3({ presentationParams });
    }
    catch (err) {
      const msg = 'Error occurred in updating presentation';
      logger.error('Error', err);
      return res.apiv3Err(new ErrorV3(msg, 'update-presentation-failed'));
    }

  });

  /**
   * @swagger
   *
   *    /markdown-setting/xss:
   *      put:
   *        tags: [MarkDownSetting]
   *        description: Update xss
   *        requestBody:
   *          required: true
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  isEnabledPrevention:
   *                    description: enable xss
   *                    type: boolean
   *                  xssOption:
   *                    description: number of xss option
   *                    type: number
   *                  tagWhiteList:
   *                    description: array of tag whiteList
   *                    type: array
   *                    items:
   *                      type: string
   *                      description: tag whitelist
   *                  attrWhiteList:
   *                    description: array of attr whiteList
   *                    type: array
   *                    items:
   *                      type: string
   *                      description: attr whitelist
   *        responses:
   *          200:
   *            description: Succeeded to update xss setting
   */
  router.put('/xss', loginRequiredStrictly, adminRequired, csrf, validator.xssSetting, ApiV3FormValidator, async(req, res) => {
    if (req.body.isEnabledXss && req.body.xssOption == null) {
      return res.apiv3Err(new ErrorV3('xss option is required'));
    }

    const xssParams = {
      'markdown:xss:isEnabledPrevention': req.body.isEnabledXss,
      'markdown:xss:option': req.body.xssOption,
      'markdown:xss:tagWhiteList': req.body.tagWhiteList,
      'markdown:xss:attrWhiteList': req.body.attrWhiteList,
    };

    try {
      await crowi.configManager.updateConfigsInTheSameNamespace('markdown', xssParams);
      return res.apiv3({ xssParams });
    }
    catch (err) {
      const msg = 'Error occurred in updating xss';
      logger.error('Error', err);
      return res.apiv3Err(new ErrorV3(msg, 'update-xss-failed'));
    }

  });

  return router;
};
