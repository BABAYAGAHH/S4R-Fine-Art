# Storage design (C1 contract only)

No bucket is created by C1. C2 will create these buckets only after an approved
Supabase project has been verified and linked through the CLI.

| Bucket | Visibility | Browser access | Intended content |
| --- | --- | --- | --- |
| `artwork-public` | Public | Read only | Approved display media referenced by `artwork_media.storage_path` |
| `artwork-masters` | Private | No direct anon/authenticated access | Paid digital masters, never public URLs |

Browser writes are not part of this contract. Future entitlement-verified
signed delivery belongs to Batch F; no signed URLs, masters, or uploads are
created in C1.
