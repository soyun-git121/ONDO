package kr.ondo.domain.project.entity;

/**
 * 실적을 어느 페이지에 노출할지. admin에서 페이지별로 따로 고른다.
 * 엔티티에는 show_on_home / show_on_collaboration 두 컬럼으로 저장하고,
 * 공개 API는 ?placement=home|collaboration 으로 받는다.
 */
public enum ProjectPlacement {
    HOME,
    COLLABORATION
}
