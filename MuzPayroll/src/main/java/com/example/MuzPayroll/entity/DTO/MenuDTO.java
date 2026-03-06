package com.example.MuzPayroll.entity.DTO;

public class MenuDTO {

    private Integer productId;
    private Integer menuRowNo;
    private Boolean optionYn;
    private Integer optionId;
    private String url;
    private String displayName;
    private String description;
    private String optionType;
    private Integer parentMenuRowNo;
    private Integer levelNo;
    private Integer solutionId;
    private Boolean Add;
    private Boolean Edit;
    private Boolean View;
    private Boolean Delete;
    private Boolean Print;
    private Boolean Deny;

    // getters + setters

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public Integer getMenuRowNo() {
        return menuRowNo;
    }

    public void setMenuRowNo(Integer menuRowNo) {
        this.menuRowNo = menuRowNo;
    }

    public Boolean getOptionYn() {
        return optionYn;
    }

    public void setOptionYn(Boolean optionYn) {
        this.optionYn = optionYn;
    }

    public Integer getOptionId() {
        return optionId;
    }

    public void setOptionId(Integer optionId) {
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

    public Integer getParentMenuRowNo() {
        return parentMenuRowNo;
    }

    public void setParentMenuRowNo(Integer parentMenuRowNo) {
        this.parentMenuRowNo = parentMenuRowNo;
    }

    public Integer getLevelNo() {
        return levelNo;
    }

    public void setLevelNo(Integer levelNo) {
        this.levelNo = levelNo;
    }

    public Integer getSolutionId() {
        return solutionId;
    }

    public void setSolutionId(Integer solutionId) {
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
