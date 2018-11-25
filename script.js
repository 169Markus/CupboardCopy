const automl = require('automl.v1beta1');

const cupboard = new automl.v1beta1.PredictionServiceClient({
  credentials: {
    client_email: "cupboard-door@cupboard-1.iam.gserviceaccount.com",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC6YQzst1WnD35j\nIXLebmoVndX9s1EIlmVn43mPVWJR76+svgaGlWvm45ybbgcUsoK+PydpaZhaFUw/\n9tYK8Q3uEKZda7lgOjBLOLX7rEXm2dfX6FByZ+hyXuDU0LtSdz78WDKtWy0pMKxi\nbumaO+JKZSiswKT1zBm8kufPkaANMEFqXdO/gVkSJgC38d7ci/wJCnYSWZDcYHSQ\naNwseVdX4JGWwo1N7pp3Kgtb9toYpygA0WRV7+M44cTbK4geUTYB5Y2Pwyds8+bJ\nUDqVPy7AFGgSmCX/iwn3kzWdG6NdwntrKoO+mom97R0+ejdnTlO9QRAVXVe7e+3X\n24V5VZsfAgMBAAECggEALyVRoaeWsRXIQMc7SWzgxOsSMITloKh6qlbubwWIQ3XA\nGJBREkZF7zfwa5jfjarCS+Gp1I5zjYYJrbyA1G+5uFjZ3JPdZqwRf1WvIySm4giF\nAwavIuGJ+TRq5yqN2AR2GFsvJo8D04GOea/Yw70WNv9z1I8+qzaf5AW9QdJyjCMT\n4J1jqgMnRU9N1VDXHuZrttx/DG0YFxyaTKyPiI+DsiGy+vYmcVLPAw7VxjG/7sB4\n1vkJxswE080v8wPmfkEycfxOyIgqYkNpAC5qaZFHNXRBWWlfLCZWJoF/NoSBcGsK\nVM1Dc66armycwNMHRVQCpi01xnD0GcUi8JXmrEABsQKBgQDtyFBmX9SGTz2oqRkR\nVbNEQg9bGboWUsWWecQoreWYx0WdU0RJaoAF5/mGnOP/gjfnZLELQjdqrbxVajS1\nSzaMx+aIyqqqG3jqGJQbp5V55n64WjzFGl/hFIdTG0sSkH6xx+TAZqQec3r9V7Jq\n0P8bZ+2nuOIh1knjk0wFT4ndfQKBgQDIqIyqkJVM7rk6To0BijhTgcv6ME4fFf6K\nT3zzKRqkoKTCGOrNRRmFDraTD5DEZ6tj8zjT4CWfLr17i3cX+OFkBwaC+yjQLJuU\n1S/1a41XuPLCYSDnziLwmknX0iYtdrBNs5XvTumgnLOcrspkWNxclq3eWD0n1O5k\nfDN6E6QtywKBgDOX3zoXWPm7f9l0t2e3fKo22zYdIu9tDkpUKWfaM5MuycAVLR/w\n585gQxgeOqpaCt8+Tdvvhi6ze8XcwYsEwtVRGohb0SQPyfChXKGTfy9v/9boXX82\n9c7UsXgq1+MzTwosIUpN+xZQYENQH/plVrUPm9VknExTPr0OXNRaKcPRAoGAZluM\nfgmJD5iLRlIBnfJ7LyX7/mEbyMG4ead4rrWeELKduSFqzVFdZkGOItCC4Z2ckTzm\nFTa3Gk+Gevo2wzTDDPqEeNZUCHVo2/AwKbo2fLQsqblQRs8hhai+2Ggr728nGkvs\nxQl1Jegpu1hyh+PIbTaz9MMAV0xIW1v8Cl7wlicCgYBvklptVq2JXIARn0TGhCZt\n93Hyr3YaMqg7sDX01bazzYDF9HMaH2DSzr6qG8jkwaURMO28uIGN8I+ZKOLHmGWr\nyQWkIfMB6kovXyk+Gs0wRsQq06yuvgGmkDdlhzksoytDGzHssLuPQUe9yGrG3h7s\nOt8P1mWDqgfcs6PfCKoQxg==\n-----END PRIVATE KEY-----\n"
  },
  projectId: "cupboard-1"
});

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.server = (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  if (req.method != 'POST') {
    res.status(200).end();
    return;
  }
  
  cupboard.predict(JSON.parse(req.body)).then(b => {
    res.status(200).send(b).end();
  });
};
