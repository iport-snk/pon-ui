Ext.define('PON.utils.Auth', {
    alias: 'utils.auth',

    statics: {
        auth: function () {
            return this.load().then( _ => {
                gapi.client.setApiKey('ebEcWZXMus26okJ0QeFqmyef');
                return gapi.auth2.init({
                    client_id: '1005615885550-roli3qdbbmek94k6gaa9eh01i8vresut.apps.googleusercontent.com',
                    scope: 'profile'
                })
            }).then( _ => {
                return new Promise( (resolve, reject) => {
                    let updateSigninStatus = isSignedIn => {
                        if (isSignedIn) {
                            let profile = auth2.currentUser.get().getBasicProfile(),
                                user = {
                                    id: profile.getId(),
                                    name: profile.getName(),
                                    email: profile.getEmail()
                                };

                            resolve(user);
                        } else {
                            auth2.signIn();
                        }
                    };
                    auth2 = gapi.auth2.getAuthInstance();
                    // Listen for sign-in state changes.
                    auth2.isSignedIn.listen(updateSigninStatus);
                    // Handle the initial sign-in state.
                    updateSigninStatus(auth2.isSignedIn.get());
                });

            }).then( user => {
                return PON.app.db.query((doc, emit) => {
                    if (doc.type === 'users') {
                        let dbUser = doc.users.find( item => item.id === user.id);
                        emit(user.id, {user: user, authenticated: dbUser});
                    }
                })
            }).then( result => {
                return new Promise( (resolve, reject) => {
                    let authResponse = result.rows[0].value;

                    if (authResponse.authenticated) {
                        resolve (authResponse.user)
                    } else {
                        reject ({status: 'Unauthorized user', user: authResponse.user})
                    }
                });
            })
        },
        load: function () {
            return new Promise( (resolve, reject ) => {
                gapi.load('client:auth2', resolve)
            })
        }
    }

});