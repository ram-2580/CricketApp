const fileUploader = require('../utils/fileUpload');
const R = require('ramda');
const db = require('../database');

const upload = fileUploader('profile-pics', 'profilePic')

module.exports.profile = async (req, res) => {
    const user = req.user
    const profile = await db.Profile.findOne({ where: { userId: user.id } })
    res.render('profile/form.ejs', { user: user, profile: profile });
}

module.exports.updateProfile = async (req, res) => {

    try {
        const profile = await db.Profile.findOne({ where: { userId: req.user.id } });

        upload(req, res, (err) => {
            if (err) {
                res.render('proflie', { err: err });
            } else {
                // req => filepath
                const filePath = R.compose(R.prop('destination'), R.prop('file'));
                // req => trimedFilePath
                const trimedFilePath = R.compose(R.replace('public', ''), R.replace('./', ''), filePath);

                const path = trimedFilePath(req) + req.file.filename
                profile.update({ 'profilePic': path })
                    .then((profile, options) => {
                        if (profile) {
                            console.log("Profile updated");
                            return res.redirect('profile');
                        }
                    })

            }
        })
    } catch (err) {
        console.log(err)
    }
}