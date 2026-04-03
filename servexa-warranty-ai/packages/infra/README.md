# How to setup env in development mode

1. Create CLOUDFLARE_API_TOKEN at<https://dash.cloudflare.com/profile/api-tokens>

2. Run request to get id

```bash
curl "https://api.cloudflare.com/client/v4/user/tokens/verify" \ 
-H "Authorization: Bearer <cf_api_token_with_permission_read_for_app_and_cf_page>"      
```

```bash
CLOUDFLARE_API_TOKEN=<cf_api_token_with_permission_read_for_app_and_cf_page>
CLOUDFLARE_ACCOUNT_ID=<id_account_from_response>
```
