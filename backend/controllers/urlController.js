const prisma = require('../utils/prisma');
const { URL } = require('url');

// Helper function to extract domain from URL
const extractDomain = (urlString) => {
  try {
    const url = new URL(urlString);
    return url.hostname;
  } catch (error) {
    return urlString;
  }
};

// @desc    Get all whitelisted URLs
// @route   GET /api/whitelisted-urls
// @access  Private (Admin only)
const getWhitelistedUrls = async (req, res) => {
  try {
    const urls = await prisma.whitelistedUrl.findMany({
      orderBy: { domain: 'asc' }
    });
    res.json(urls);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Add whitelisted URL
// @route   POST /api/whitelisted-urls
// @access  Private (Admin only)
const addWhitelistedUrl = async (req, res) => {
  try {
    const { url } = req.body;
    const domain = extractDomain(url);

    const whitelistedUrl = await prisma.whitelistedUrl.create({
      data: {
        url,
        domain,
        createdById: req.user.id,
        updatedById: req.user.id
      }
    });

    res.status(201).json(whitelistedUrl);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'URL already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Delete whitelisted URL
// @route   DELETE /api/whitelisted-urls/:id
// @access  Private (Admin only)
const deleteWhitelistedUrl = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.whitelistedUrl.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'URL removed from whitelist' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get all blocked URLs
// @route   GET /api/blocked-urls
// @access  Private (Admin only)
const getBlockedUrls = async (req, res) => {
  try {
    const urls = await prisma.blockedUrl.findMany({
      orderBy: { domain: 'asc' }
    });
    res.json(urls);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Add blocked URL
// @route   POST /api/blocked-urls
// @access  Private (Admin only)
const addBlockedUrl = async (req, res) => {
  try {
    const { url } = req.body;
    const domain = extractDomain(url);

    const blockedUrl = await prisma.blockedUrl.create({
      data: {
        url,
        domain,
        createdById: req.user.id,
        updatedById: req.user.id
      }
    });

    res.status(201).json(blockedUrl);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'URL already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Delete blocked URL
// @route   DELETE /api/blocked-urls/:id
// @access  Private (Admin only)
const deleteBlockedUrl = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.blockedUrl.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'URL removed from blocklist' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Check if URL is allowed
// @route   POST /api/check-url
// @access  Private
const checkUrl = async (req, res) => {
  try {
    const { url } = req.body;
    const domain = extractDomain(url);

    // Check if URL is blocked
    const blockedUrl = await prisma.blockedUrl.findFirst({
      where: {
        OR: [
          { url },
          { domain }
        ]
      }
    });

    if (blockedUrl) {
      return res.json({ allowed: false, reason: 'URL is blocked' });
    }

    // Check if URL is whitelisted
    const whitelistedUrl = await prisma.whitelistedUrl.findFirst({
      where: {
        OR: [
          { url },
          { domain }
        ]
      }
    });

    if (whitelistedUrl) {
      return res.json({ allowed: true });
    }

    // If no whitelist exists, allow by default
    const whitelistCount = await prisma.whitelistedUrl.count();
    if (whitelistCount === 0) {
      return res.json({ allowed: true });
    }

    // If whitelist exists but URL is not in it, block
    return res.json({ allowed: false, reason: 'URL is not whitelisted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getWhitelistedUrls,
  addWhitelistedUrl,
  deleteWhitelistedUrl,
  getBlockedUrls,
  addBlockedUrl,
  deleteBlockedUrl,
  checkUrl
}; 