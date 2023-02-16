const roles = [
  {
    _id: 'admin',
    modules: [
      'client.create',
      'client.read',
      'client.update',
      'client.delete',
      'task.read',
      'product.read',
      'product.update',
      'product.delete',
      'product.create',
      'order.read',
      'order.create',
      'order.update',
      'order.delete',
      'order.approveBill',
      'settings.read',
      'user.delete',
      'user.create',
      'user.read',
      'user.update',
      'measurement.read',
      'measurement.create',
      'measurement.update',
      'measurement.delete',
      'product.read',
      'product.create',
      'product.update',
      'product.delete',
      'parent-product.read',
      'parent-product.create',
      'parent-product.update',
      'parent-product.delete',
      'category.read',
      'category.create',
      'category.update',
      'category.delete',
      'sub-category.read',
      'sub-category.create',
      'sub-category.update',
      'sub-category.delete',
      'cart.read',
      'cart.create',
      'cart.update',
      'cart.delete',
      'notification.send',
      'discount.read',
      'discount.create',
      'discount.update',
      'discount.delete',
      'reward.read',
      'reward.create',
      'reward.update',
      'reward.delete',
      'feedback.read',
      'feedback.create',
      'feedback.update',
      'feedback.delete',
      'rewardRedeem.read',
      'scheme.read',
      'scheme.create',
      'scheme.update',
      'scheme.delete',
      'slider.read',
      'slider.create',
      'slider.update',
      'slider.delete',
      'reward.review',
      'promoCode.create',
      'promoCode.update',
      'promoCode.delete',
      'promoCode.read',
      'dashboard.read',
      "collection.read",
      "collection.create",
      "collection.update",
      "collection.delete",
    ]
  },
  {
    _id: 'subAdmin',
    modules: [
      'client.create',
      'client.read',
      'client.update',
      'client.delete',
      'task.read',
      'product.read',
      'product.update',
      'product.delete',
      'product.create',
      'order.read',
      'order.create',
      'order.update',
      'order.delete',
      'settings.read',
      'user.delete',
      'user.create',
      'user.read',
      'user.update',
      'order.read',
      'order.create',
      'order.update',
      'order.delete',
      'measurement.read',
      'measurement.create',
      'category.read',
      'category.create',
      'category.update',
      'sub-category.read',
      'sub-category.create',
      'sub-category.update',
      'parent-product.read',
      'parent-product.create',
      'parent-product.update',
      'product.read',
      'product.create',
      'product.update',
      'feedback.read',
      'feedback.create',
      'feedback.update',
      'feedback.delete',
      'rewardRedeem.read',
      'reward.review',
      'promoCode.read',
      'scheme.read',
      'discount.read',
      'reward.read',
      'slider.read',
      'dashboard.read'
    ]
  },
  {
    _id: 'mr',
    modules: [
      'user.create',
      'product.read',
      'product.update',
      'product.delete',
      'product.create',
      'user.read',
      'cart.read',
      'cart.create',
      'cart.update',
      'cart.delete',
      'order.read',
      'order.create',
      'order.update',
      'order.delete',
      'measurement.read',
      'category.read',
      'sub-category.read',
      'parent-product.read',
      'product.read',
      'feedback.read',
      'feedback.create',
      'feedback.update',
      'feedback.delete',
      'rewardRedeem.read',
      'reward.redeem',
      'promoCode.read',
      'scheme.read',
      'discount.read',
      'reward.read',
      'slider.read'
    ]
  },
  {
    _id: 'mrManager',
    modules: [
      'product.read',
      'user.create',
      'product.update',
      'product.delete',
      'product.create',
      'user.read',
      'cart.read',
      'cart.create',
      'cart.update',
      'cart.delete',
      'order.read',
      'order.create',
      'order.update',
      'order.delete',
      'measurement.read',
      'category.read',
      'sub-category.read',
      'parent-product.read',
      'product.read',
      'feedback.read',
      'feedback.create',
      'feedback.update',
      'feedback.delete',
      'rewardRedeem.read',
      'reward.redeem',
      'promoCode.read',
      'scheme.read',
      'discount.read',
      'reward.read',
      'slider.read'
    ]
  },
  {
    _id: 'retailer',
    modules: [
      'client.read.y',
      'task.read.y',
      'documents.read.y',
      'documents.update.y',
      'user.read',
      'cart.read',
      'cart.create',
      'cart.update',
      'cart.delete',
      'order.read',
      'order.create',
      'order.update',
      'order.delete',
      'measurement.read',
      'category.read',
      'sub-category.read',
      'parent-product.read',
      'product.read',
      'feedback.read',
      'feedback.create',
      'feedback.update',
      'feedback.delete',
      'rewardRedeem.read',
      'reward.redeem',
      'promoCode.read',
      'scheme.read',
      'discount.read',
      'reward.read',
      'slider.read'
    ]
  },
  {
    _id: 'stockist',
    modules: [
      'client.read.y',
      'task.read.y',
      'documents.read.y',
      'documents.update.y',
      'user.read',
      'order.read',
      'order.create',
      'order.update',
      'order.delete',
      'measurement.read',
      'category.read',
      'sub-category.read',
      'parent-product.read',
      'product.read',
      'feedback.read',
      'feedback.create',
      'feedback.update',
      'feedback.delete',
      'rewardRedeem.read',
      'cart.read',
      'cart.create',
      'cart.update',
      'cart.delete',
      'reward.redeem',
      'promoCode.read',
      'scheme.read',
      'discount.read',
      'reward.read',
      'slider.read'
    ]
  },
  {
    _id: 'distributor',
    modules: [
      'client.read.y',
      'task.read.y',
      'documents.read.y',
      'documents.update.y',
      'user.read',
      'measurement.read',
      'category.read',
      'sub-category.read',
      'parent-product.read',
      'product.read',
      'feedback.read',
      'feedback.create',
      'feedback.update',
      'feedback.delete',
      'rewardRedeem.read',
      'reward.redeem',
      'reward.read',
      'promoCode.read',
      'scheme.read',
      'discount.read',
      'slider.read'
    ]
  }, {
    _id: 'customer',
    modules: [
      'user.read',
      'cart.read',
      'cart.create',
      'cart.update',
      'cart.delete',
      'order.read',
      'order.create',
      'order.update',
      'order.delete',
      'measurement.read',
      'category.read',
      'sub-category.read',
      'parent-product.read',
      'product.read',
      'feedback.read',
      'feedback.create',
      'feedback.update',
      'feedback.delete',
      'rewardRedeem.read',
      'reward.redeem',
      'promoCode.read',
      'scheme.read',
      'discount.read',
      'reward.read',
      'slider.read'
    ]
  }
];

module.exports = roles;
