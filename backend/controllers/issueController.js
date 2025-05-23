const Issue = require('../models/Issue');

exports.reportIssue = async (req, res) => {
  const { title, description, category, location, imageUrl } = req.body;

  try {
    const issue = new Issue({
      title,
      description,
      category,
      location,
      imageUrl,
      reportedBy: req.user.id
    });

    await issue.save();
    console.log('Saved Issue:', issue); // Log the saved issue
    res.status(201).json({ message: 'Issue reported successfully', issue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllIssues = async(req, res) => {
    try {
        const issues = await Issue.find().populate('reportedBy', 'name email');
        res.json(issues);
    } catch(err){
        res.status(500).json({message: err.message})
    }
};