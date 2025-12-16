DISPOSABLE_DOMAINS = {
    "mailinator.com",
    "tempmail.com",
    "guerrillamail.com",
    "yopmail.com",
    "10minutemail.com",
    "sharklasers.com",
    "throwawaymail.com",
    "getairmail.com",
    "mailna.me",
    "temp-mail.org"
}

def is_disposable_email(email: str) -> bool:
    try:
        domain = email.split('@')[1].lower()
        return domain in DISPOSABLE_DOMAINS
    except IndexError:
        return False
