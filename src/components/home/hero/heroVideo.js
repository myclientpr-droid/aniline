import { LinearFilter, LinearSRGBColorSpace, VideoTexture } from 'three';

/**
 * Owns a detached <video> and the THREE texture bound to it. A detached element decodes and plays in
 * every engine we target, and keeps the media out of the DOM (no stray focusable or painted node).
 *
 * @param {string} src
 */
export function createHeroVideo(src) {
    const video = document.createElement('video');
    // Must be set before src, or the texture is tainted and texImage2D throws.
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.disablePictureInPicture = true;
    video.src = src;

    const texture = new VideoTexture(video);
    // No hardware sRGB decode: the shader writes sRGB straight to the drawing buffer.
    texture.colorSpace = LinearSRGBColorSpace;
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.generateMipmaps = false;

    return { video, texture };
}

export function disposeHeroVideo({ video, texture }) {
    if (texture._requestVideoFrameCallbackId && typeof video.cancelVideoFrameCallback === 'function') {
        video.cancelVideoFrameCallback(texture._requestVideoFrameCallbackId);
        texture._requestVideoFrameCallbackId = 0;
    }
    video.pause();
    video.removeAttribute('src');
    video.load();
    texture.dispose();
}
