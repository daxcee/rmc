import logging

LOG_CATEGORY_TRANSCRIPT = 'TRANSCRIPT'
LOG_EVENT_UPLOAD = 'UPLOAD'
LOG_EVENT_REMOVE = 'REMOVE'

LOG_CATEGORY_SCHEDULE = 'SCHEDULE'

LOG_CATEGORY_DATA_MODEL = 'DATA_MODEL'
LOG_EVENT_UNKNOWN_COURSE_ID = 'UNKNOWN_COURSE_ID'

# TODO(Sandy): Should move this to the API category?
LOG_CATEGORY_COURSE_SEARCH = 'COURSE_SEARCH'
LOG_EVENT_SEARCH_PARAMS = 'SEARCH_PARAMS'

LOG_CATEGORY_IMPRESSION = 'IMPRESSION'
LOG_EVENT_ABOUT = 'ABOUT'
LOG_EVENT_LANDING = 'LANDING'
LOG_EVENT_LOGIN = 'LOGIN'
LOG_EVENT_ONBOARDING = 'ONBOARDING'
LOG_EVENT_PROFILE = 'PROFILE'
LOG_EVENT_PRIVACY_POLICY = 'PRIVACY_POLICY'
LOG_EVENT_SINGLE_COURSE = 'SINGLE_COURSE'
LOG_EVENT_UNSUBSCRIBE = 'UNSUBSCRIBE'

LOG_CATEGORY_API = 'API'
LOG_EVENT_USER_COURSE = 'USER_COURSE'
LOG_EVENT_REMOVE_COURSE = 'REMOVE_COURSE'
LOG_EVENT_TRANSCRIPT = 'TRANSCRIPT'
LOG_EVENT_UNSUBSCRIBE_USER = 'UNSUBSCRIBE_USER'
LOG_EVENT_RENEW_FB = 'RENEW_FB'
LOG_EVENT_SCHEDULE = 'SCHEDULE'

# TODO(Sandy): Do better logging
# E.g. log_event('TRANSCRIPT', 'REMOVE', { 'user_id': ID_HERE })
def log_event(category, event_name, data=None):
    log_msg = "Event Logged: %s %s" % (category, event_name)

    if data:
        log_msg += " %s" % data

    logging.info(log_msg)
