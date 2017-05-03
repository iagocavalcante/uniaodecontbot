module.exports = (req, res) => {
    const hubChallenge = req.query['hub.challenge'];

    const hubMode = req.query['hub.mode'];
    const verifyTokenMatches = (req.query['hub.verify_token'] === 'EAARnZCjoA6J4BAJu4dabKK2M2ZBh1YJGAMRkSCfd9JLDZBtKa5CbmDzdjmRACm4m71VqJAzmyIn8fJZA3LeGCfON3asigZCvBJqql8OtDy6e6rmqLgMe8ENEMGIXC0HAyjwbZBrx581Om5d3R7queNCSdQxYti5lWM5Epyz4AugQZDZD');

    if (hubMode && verifyTokenMatches) {
        res.status(200).send(hubChallenge);
    } else {
        res.status(403).end();
    }
};