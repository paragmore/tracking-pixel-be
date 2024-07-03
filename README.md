# Tracking Pixel

This tracking pixel can be used to generate a image url which can be inserted into github profile readme and this will count number of unique visitors on your profile and provide you stats about it.

## Test at:
https://tracking-pixel-be.vercel.app/track/username

## Create your your tracking pixel using post endpoint:

```
curl --location 'https://tracking-pixel-l26cfi5fu-paragmores-projects.vercel.app/register' \
--header 'Content-Type: application/json' \
--header 'Cookie: _vercel_sso_nonce=QidTOPBzQA5sO2LqLjTBZVmq' \
--data '{
    "username": "username",
    "githubUsername": "githubUsername"
}'
```

## Stats at:
https://tracking-pixel-be.vercel.app/stats/username

