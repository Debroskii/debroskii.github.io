const invitees = [
    profile("Tom", "", "Ahhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh!"),
    profile("Amanda", "", "This summer is going to be even bigger than the last.")
];

function profile(name, photo_url, message) {
    return {
        name: name,
        photo_url: photo_url,
        message: message
    };
}