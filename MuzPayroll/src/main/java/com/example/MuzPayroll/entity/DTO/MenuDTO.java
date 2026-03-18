package com.example.MuzPayroll.entity.DTO;

public class MenuDTO {

    private Long productId;
    private Long menuRowNo;
    private Boolean optionYn;
    private Long optionId;
    private String url;
    private String displayName;
    private String description;
    private String optionType;
    private Long parentMenuRowNo;
    private Long levelNo;
    private Long solutionId;
    private Boolean Add;
    private Boolean Edit;
    private Boolean View;
    private Boolean Delete;
    private Boolean Print;
    private Boolean Deny;

    // getters + setters

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Long getMenuRowNo() {
        return menuRowNo;
    }

    public void setMenuRowNo(Long menuRowNo) {
        this.menuRowNo = menuRowNo;
    }

    public Boolean getOptionYn() {
        return optionYn;
    }

    public void setOptionYn(Boolean optionYn) {
        this.optionYn = optionYn;
    }

    public Long getOptionId() {
        return optionId;
    }

    public void setOptionId(Long optionId) {
        this.optionId = optionId;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getOptionType() {
        return optionType;
    }

    public void setOptionType(String optionType) {
        this.optionType = optionType;
    }

    public Long getParentMenuRowNo() {
        return parentMenuRowNo;
    }

    public void setParentMenuRowNo(Long parentMenuRowNo) {
        this.parentMenuRowNo = parentMenuRowNo;
    }

    public Long getLevelNo() {
        return levelNo;
    }

    public void setLevelNo(Long levelNo) {
        this.levelNo = levelNo;
    }

    public Long getSolutionId() {
        return solutionId;
    }

    public void setSolutionId(Long solutionId) {
        this.solutionId = solutionId;
    }

    public Boolean getAdd() {
        return Add;
    }

    public void setAdd(Boolean Add) {
        this.Add = Add;
    }

    public Boolean getEdit() {
        return Edit;
    }

    public void setEdit(Boolean Edit) {
        this.Edit = Edit;
    }

    public Boolean getView() {
        return View;
    }

    public void setView(Boolean View) {
        this.View = View;
    }

    public Boolean getPrint() {
        return Print;
    }

    public void setPrint(Boolean Print) {
        this.Print = Print;
    }

    public Boolean getDelete() {
        return Delete;
    }

    public void setDelete(Boolean Delete) {
        this.Delete = Delete;
    }

    public Boolean getDeny() {
        return Deny;
    }

    public void setDeny(Boolean Deny) {
        this.Deny = Deny;
    }
}
