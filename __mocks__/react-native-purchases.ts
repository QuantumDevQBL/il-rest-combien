const PACKAGE_TYPE = {
  ANNUAL: 'ANNUAL',
  MONTHLY: 'MONTHLY',
};

const LOG_LEVEL = {
  DEBUG: 'DEBUG',
};

const purchases = {
  configure: jest.fn(),
  setLogLevel: jest.fn(),
  getOfferings: jest.fn(async () => ({
    current: {
      availablePackages: [
        {
          identifier: '$rc_annual',
          packageType: PACKAGE_TYPE.ANNUAL,
          product: { priceString: '39,99 €/an' },
        },
        {
          identifier: '$rc_monthly',
          packageType: PACKAGE_TYPE.MONTHLY,
          product: { priceString: '4,99 €/mois' },
        },
      ],
    },
  })),
  getCustomerInfo: jest.fn(async () => ({
    entitlements: { active: {} },
  })),
  purchasePackage: jest.fn(),
  restorePurchases: jest.fn(async () => ({
    entitlements: { active: {} },
  })),
  addCustomerInfoUpdateListener: jest.fn(),
  removeCustomerInfoUpdateListener: jest.fn(),
};

export default purchases;
export { LOG_LEVEL, PACKAGE_TYPE };
