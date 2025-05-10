const prisma = require('../utils/prisma');

// @desc    Get all settings
// @route   GET /api/settings
// @access  Private
const getSettings = async (req, res) => {
  try {
    const settings = await prisma.settings.findMany({
      orderBy: { key: 'asc' }
    });

    // Convert settings array to object
    const settingsObject = settings.reduce((acc, setting) => {
      let value = setting.value;
      
      // Convert value based on type
      switch (setting.type) {
        case 'boolean':
          value = value === 'true';
          break;
        case 'number':
          value = Number(value);
          break;
        case 'json':
          try {
            value = JSON.parse(value);
          } catch (e) {
            value = value;
          }
          break;
      }

      acc[setting.key] = value;
      return acc;
    }, {});

    res.json(settingsObject);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get setting by key
// @route   GET /api/settings/:key
// @access  Private
const getSettingByKey = async (req, res) => {
  try {
    const { key } = req.params;

    const setting = await prisma.settings.findUnique({
      where: { key }
    });

    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    let value = setting.value;
    
    // Convert value based on type
    switch (setting.type) {
      case 'boolean':
        value = value === 'true';
        break;
      case 'number':
        value = Number(value);
        break;
      case 'json':
        try {
          value = JSON.parse(value);
        } catch (e) {
          value = value;
        }
        break;
    }

    res.json({ [key]: value });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Create or update setting
// @route   POST /api/settings
// @access  Private (Admin only)
const upsertSetting = async (req, res) => {
  try {
    const { key, value, type = 'string' } = req.body;

    // Validate type
    const validTypes = ['string', 'boolean', 'number', 'json'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid type' });
    }

    // Convert value to string based on type
    let stringValue = value;
    if (type === 'boolean') {
      stringValue = String(Boolean(value));
    } else if (type === 'number') {
      stringValue = String(Number(value));
    } else if (type === 'json') {
      stringValue = JSON.stringify(value);
    }

    const setting = await prisma.settings.upsert({
      where: { key },
      update: {
        value: stringValue,
        type,
        updatedById: req.user.id
      },
      create: {
        key,
        value: stringValue,
        type,
        createdById: req.user.id,
        updatedById: req.user.id
      }
    });

    res.json(setting);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Delete setting
// @route   DELETE /api/settings/:key
// @access  Private (Admin only)
const deleteSetting = async (req, res) => {
  try {
    const { key } = req.params;

    await prisma.settings.delete({
      where: { key }
    });

    res.json({ message: 'Setting deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getSettings,
  getSettingByKey,
  upsertSetting,
  deleteSetting
}; 