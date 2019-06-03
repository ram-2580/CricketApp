const { fileUploader, trimedFilePath } = require('../utils/fileUpload');
const R = require('ramda');
const db = require('../database');

const upload = fileUploader('profile-pics', 'profilePic')

module.exports.profile = async (req, res) => {
    const user = req.user
    const profile = await db.Profile.findOne({ where: { userId: user.id } })
    res.render('profile/form.ejs', { user: user, profile: profile, messages: req.flash('message') });
}

module.exports.updateProfile = async (req, res) => {

    try {
        const profile = await db.Profile.findOne({ where: { userId: req.user.id } });

        upload(req, res, (err) => {
            if (err) {
                req.flash('message', 'Can not upload profile')
                res.redirect('/proflie');
            } else {
                console.log(req.file)
                const path = trimedFilePath(req) + req.file.filename
                profile.update({ 'profilePic': path })
                    .then((profile, options) => {
                        if (profile) {
                            req.flash('message', 'Profile pic has updated')
                            return res.redirect('/profile');
                        }
                    })

            }
        })
    } catch (err) {
        console.log(err)
    }
}

// module.exports.updateProfile = (req, res) => {
//     const profile = db.Profile.findOne({ where: { userId: req.user.id } });
//     console.log(profile);
//     res.redirect('/profile')
// }