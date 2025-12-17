REPUTED_DOMAINS = {
    "gmail.com",
    "googlemail.com",
    "outlook.com",
    "hotmail.com",
    "live.com",
    "yahoo.com",
    "yahoo.co.uk",
    "yahoo.co.in",
    "icloud.com",
    "me.com",
    "msn.com",
    "aol.com",
    "protonmail.com",
    "proton.me",
    "zoho.com",
    "gmx.com",
    "mail.com"
}

def is_reputed_email(email: str) -> bool:
    try:
        domain = email.split('@')[1].lower()
        return domain in REPUTED_DOMAINS
    except IndexError:
        return False
