export const ACTIVITY_ACTIONS = {
    SUBMISSION_CREATED: 'submission_created',
    USER_JOINED: 'user_joined',
    FORM_PUBLISHED: 'form_published',
    PROJECT_CREATED: 'project_created',
    FORM_CREATED: 'form_created',
    MANAGER_INVITED: 'manager_invited',
};

export const ACTIVITY_TYPES = {
    SUBMISSION: 'submission',
    USER: 'user',
    MEMBER: 'member',
    MANAGER: 'manager',
    FORM: 'form',
    PROJECT: 'project',
};

export const getActivityType = (action) => {
    const actionMap = {
        [ACTIVITY_ACTIONS.SUBMISSION_CREATED]: ACTIVITY_TYPES.SUBMISSION,
        [ACTIVITY_ACTIONS.USER_JOINED]: ACTIVITY_TYPES.USER,
        [ACTIVITY_ACTIONS.FORM_PUBLISHED]: ACTIVITY_TYPES.FORM,
        [ACTIVITY_ACTIONS.PROJECT_CREATED]: ACTIVITY_TYPES.PROJECT,
        [ACTIVITY_ACTIONS.FORM_CREATED]: ACTIVITY_TYPES.FORM,
        [ACTIVITY_ACTIONS.MANAGER_INVITED]: ACTIVITY_TYPES.USER,
    };
    return actionMap[action] || ACTIVITY_TYPES.PROJECT;
};
