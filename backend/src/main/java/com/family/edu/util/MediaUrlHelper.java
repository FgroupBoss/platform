package com.family.edu.util;

public final class MediaUrlHelper {

    private static final String STREAM_PREFIX = "/api/v1/media/stream/";

    private MediaUrlHelper() {
    }

    public static String streamUrl(Long mediaId) {
        if (mediaId == null) {
            return null;
        }
        return STREAM_PREFIX + mediaId;
    }

    public static String mediaIdString(Long mediaId) {
        return mediaId == null ? null : String.valueOf(mediaId);
    }
}
