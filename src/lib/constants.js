export const PROJECT_CATEGORIES = [
    'Documentary',
    'Promotional',
    'Commercial',
    'Wedding',
    'Events',
    'Music Video',
    'NGO and Charity',
    'School',
    'Creative Production',
    'Post-Production',
    'Video Editing',
    'Photography',
    'Other',
];


export const PROJECT_VIDEO_ASPECT_RATIOS = ['16:9', '9:16'];

/** Shapes the photography grid can tile with. Ordered narrow to wide. */
export const PHOTO_GRID_SHAPES = ['4:5', '4:3', '3:2'];

/**
 * The film words from PROJECT_CATEGORIES, minus the ones that are not a film:
 * Photography (a still), Post-Production and Video Editing (services done to the client's footage,
 * already covered by /services/video-editing) and Other (a chip that would match nothing).
 */
export const VIDEO_CATEGORIES = [
    'Documentary',
    'Promotional',
    'Commercial',
    'Wedding',
    'Events',
    'Music Video',
    'NGO and Charity',
    'School',
    'Creative Production',
];

export const PHOTOGRAPHY_CATEGORIES = [
    'Wedding',
    'Events',
    'Portraits',
    'Documentary',
    'Organizations',
    'Commercial',
    'Creative',
];

export const CLIENT_TYPES = [
    'Organization',
    'Business',
    'School',
    'Filmmaker',
    'Journalist',
    'Researcher',
    'Artist',
    'Musician',
    'Family',
    'Individual',
    'NGO',
    'Charity',
    'Other',
];

export const TEAM_ROLES = [
    'Founder',
    'Director',
    'Producer',
    'Cinematographer',
    'Photographer',
    'Editor',
    'Colorist',
    'Sound Designer',
    'Production Coordinator',
];

export const PUBLISH_STATUS = {
    DRAFT: 'draft',
    PUBLISHED: 'published',
};

export const INQUIRY_STATUS = {
    NEW: 'new',
    REVIEWED: 'reviewed',
    ARCHIVED: 'archived',
};