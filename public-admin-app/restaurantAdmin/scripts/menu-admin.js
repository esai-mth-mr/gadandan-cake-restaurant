{
    console.log("===menu-admin.js");
    ///===Initialize
    let db = firebase.firestore();
    const imageCropModalElement = document.getElementById("cropModalWindow");
    ///=== formのパーツ
    const modalAreaElement = document.getElementById("modalArea");
    const formPriceElement = document.getElementById("form-price");
    const formNameElement = document.getElementById("form-item-name");
    const formItemDescriptionElement = document.getElementById("form-item-description");
    const formItemIngredientsElement = document.getElementById("form-ingredients");
    const formContentsGramElement = document.getElementById("form-contents-gram");
    /// セール価格
    const formSalsePriceElement = document.getElementById("form-sale-price");
    /// セール価格適用チェック
    const formSalsePriceCheckElement = document.getElementById("form-sale-check");
    /// ご飯が含まれるかチェック
    const formContainRiceCheckElement = document.getElementById("form-contain-rice");
    /// メニューおすすめチェック
    const formRecommendedMenuCheckElement = document.getElementById("form-recommended-menu");
    /// 保存方法のspanのテキスト
    const formPreservationElement = document.getElementById("preservation-method-text");
    const formExpirationElement = document.getElementById("expiration-date-text");
    const formPreservationSelectboxElement = document.getElementById("preservation_method");
    const allergenListArray = ["卵", "乳", "小麦", "落花生", "えび", "そば", "かに", "くるみ"]
    const plusMinusImageArray = ["images/plus.png", "images/minus.png"];

    let initialToppingList = [];
    let currentlToppingList = [];

    /// メニューが追加された時に追加するコード
    let menu_div_code = `\
    <div class="menu-divs">
    <img class="test_food_img menu-items" src="images/no_image.png" width= alt="">\
    <label>\
    <!-- <span class="food-img-label" title="ファイルを選択">\
        <img src="images/camera.png"" width="32" height="26" alt="＋画像">\
    </span> -->\
    <input type="file" class="food_img_file" name="1" id="food-img-input" onChange="foodImgPreView(event, this)">\
    </label>\
    <img class="menu-option" src="images/note.jpeg" alt="＋画像">\
    <img class="image-crop" src="images/camera.png" alt="＋画像">\
    <img class="is-show-img" src="images/show.png" alt="＋画像">\
    <span class="value-tag"><span class="item-value"></span>円</span>\
    <span class="item-name"></span>\
    \
    <label class="tmp-hidden">
    <input type="checkbox" checked class="is-show-check" name=''><i
    class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span
    class="">is-show</span>
    </label>
    <span class="item-description-title tmp-hidden">■商品説明：</span>	\
    <p class="item-description tmp-hidden"></p>\
    <p class="item-description-all-show"></p>\
    \
    <p class="ingredients-title tmp-hidden">■原材料：</p>\
    <p class="ingredients tmp-hidden"></p>\
    <p class="ingredients-all-show"></p>\
    \
    <p class="allergen-title tmp-hidden">■アレルゲン：</p>\
    <p class="allergen tmp-hidden">\
    <label class="">\
        <input type="checkbox" disabled="disabled" class="allergen-check hidden-org-checkbox" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-allergen">卵</span>\
    </label>\
    <label class="">\
        <input type="checkbox" disabled="disabled" class="allergen-check hidden-org-checkbox" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-allergen">乳</span>\
    </label>\
    <label class="">\
        <input type="checkbox" disabled="disabled" class="allergen-check hidden-org-checkbox" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-allergen">小麦</span>\
    </label>\
    <label class="">\
        <input type="checkbox" disabled="disabled" class="allergen-check hidden-org-checkbox" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-allergen">落花生</span>\
    </label>\
    <label class="">\
        <input type="checkbox" disabled="disabled" class="allergen-check hidden-org-checkbox" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-allergen">えび</span>\
    </label>\
    <label class="">\
        <input type="checkbox" disabled="disabled" class="allergen-check hidden-org-checkbox" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-allergen">そば</span>\
    </label>\
    <label class="">\
        <input type="checkbox" disabled="disabled" class="allergen-check hidden-org-checkbox" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-allergen">かに</span>\
    </label>\
    <label class="">\
        <input type="checkbox" disabled="disabled" class="allergen-check hidden-org-checkbox" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-allergen">くるみ</span>\
    </label>\
    </p>\
    <p class="allergen-all-show">\
    <label class="">\
        <input type="checkbox" disabled="disabled" class="allergen-check-show hidden-org-checkbox" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-allergen">卵</span>\
    </label>\
    <label class="">\
        <input type="checkbox" disabled="disabled" class="allergen-check-show hidden-org-checkbox" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-allergen">乳</span>\
    </label>\
    <label class="">\
        <input type="checkbox" disabled="disabled" class="allergen-check-show hidden-org-checkbox" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-allergen">小麦</span>\
    </label>\
    <label class="">\
        <input type="checkbox" disabled="disabled" class="allergen-check-show hidden-org-checkbox" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-allergen">落花生</span>\
    </label>\
    <label class="">\
        <input type="checkbox" disabled="disabled" class="allergen-check-show hidden-org-checkbox" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-allergen">えび</span>\
    </label>\
    <label class="">\
        <input type="checkbox" disabled="disabled" class="allergen-check-show hidden-org-checkbox" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-allergen">そば</span>\
    </label>\
    <label class="">\
        <input type="checkbox" disabled="disabled" class="allergen-check-show hidden-org-checkbox" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-allergen">かに</span>\
    </label>\
    <label class="">\
        <input type="checkbox" disabled="disabled" class="allergen-check-show hidden-org-checkbox" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-allergen">くるみ</span>\
    </label>\
    </p>\
    \
    <!-- <p class="spiciness-title tmp-hidden">■辛さ選択：</p>
    <p class="spiciness tmp-hidden">No</p>
    <p class="amount-title tmp-hidden">■量の選択：</p>
    <p class="amount tmp-hidden">No</p> -->
    <p class="contents-gram-title tmp-hidden">■内容量（g）：</p>
    <p class="contents-gram tmp-hidden"><span class="contents-gram-value"></span>[g]</span></p>
    <p class="preservation-expiration-title tmp-hidden">■保存方法：</p>
    <p class="preservation-expiration tmp-hidden">
    <span class="preservation-num"></span><span class="preservation-text"></span>
    </p>
    <p class="preservation-expiration-all-show">
    <span class="preservation-num-all-show"></span><span class="preservation-text-all-show"></span>
    </p>
    <p class="img-url-title tmp-hidden">■画像URL（普段は非表示）</p>
    <span class="img-url-text tmp-hidden"></span>
    </p>
    <p class="org-img-url-title tmp-hidden">■元画像URL（普段は非表示）</p>
    <span class="org-img-url-text tmp-hidden"></span>
    </p>
    <!-- クロップ領域の情報 -->
    <p class="crop-left tmp-hidden" data-left=0.16666666666668561></p>
    <p class="crop-top tmp-hidden" data-top=0></p>
    <p class="crop-width tmp-hidden" data-width=312.5333333333333></p>
    <p class="crop-height tmp-hidden" data-height=175.8></p>
    <!-- 元画像 -->
    <!-- <img class="org-menu-image" src="images/no_image.png" alt="元画像（普段は非表示）"> -->
    <img class="org-menu-image tmp-hidden" src="images/no_image.png" alt="元画像（普段は非表示）">
    <p class="topping-title tmp-hidden">■トッピング：</p>
    <p class="topping tmp-hidden"></p>
    <p class="topping-all-show"></p>
    <p class="general-option-title tmp-hidden">■オプション：</p>
    <p class="general-option tmp-hidden"></p>
    <p class="general-option-all-show"></p>
    \
    <p class="food-sale-price-title tmp-hidden">■セール価格：</p>
    <p class="food-sale-price tmp-hidden">
    <span class="food-sale-price-value">0</span>
    <label class="">
        <input type="checkbox" disabled="disabled" class="food-sale-price-check" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="">適用</span>
    </label>
    </p>
    <p class="contain-rice-title tmp-hidden">■ご飯、材料：</p>
    <p class="contain-rice tmp-hidden">
    <label class="">
        <input type="checkbox" disabled="disabled" class="contain-rice-check" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="">ご飯あり</span>
    </label>
    </p>
    <p class="food-sale-price-all-show"></p>
    <p class="recommended-menu-title tmp-hidden">■おすすめメニュー：</p>
    <p class="recommended-menu tmp-hidden">
    <label class="">
        <input type="checkbox" disabled="disabled" class="recommended-menu-check" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i>
    </label>
    </p>
    <p class="is-image-renew-title tmp-hidden">■画像の新規追加があるか：</p>
    <p class="is-image-renew tmp-hidden">
    <!-- <p class="is-image-renew-all-show"></p> -->
    <label class="">
        <input type="checkbox" disabled="disabled"
        class="is-image-renew-check hidden-org-checkbox" name=''><i
        class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i>
    </label>
    </p>
    <p class="is-image-change-title tmp-hidden">■画像の編集があるかどうか：</p>
    <p class="is-image-change tmp-hidden">
    <!-- <p class="is-image-change-all-show"></p> -->
    <label class="">
        <input type="checkbox" disabled="disabled"
        class="is-image-change-check hidden-org-checkbox" name=''><i
        class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i>
    </label>
    </p>
    <img class="my-trash" src="images/trash.jpeg" alt="＋画像">\
    </div>\
    `;

    ///===サイズ用のオプション
    let amountSettingDiv = `\
    <div class="option-setting-box tmp-hidden">
    <div class="option-wrapper tmp-hidden">
    <dt class="toggle_title">
        <img class="img-plus-minus img-minus" src="images/minus.png" alt="" >
        <div class="option-name-wrapper">
        <span class="option-title">オプション名：</span><span class="option-text">サイズ</span><span class="option-text-edit"><i class="fas fa-pen"></i></span>
        </div>
        <div class="indivisual-setting">
        <label class="multiple-setting-checkbox-label">
            <input class="multiple-checkbox" type="checkbox" name="multiple-checkbox-name" disabled>複数選択可能
        </label>
        </div>
        <div class="indivisual-setting">
        <label class="rice-setting-checkbox-label">
            <input class="rice-checkbox" type="checkbox" name="rice-checkbox-name">ご飯の消費量も変わるか
        </label>
        </div>
        <div class="delete-option-item-div f-right">
        <img class="delete-all-option-item" src="images/trash.png" alt="＋画像">
        </div>
    </dt>
    </div>
    <div class="toggle_contents tmp-hidden">
    <div class="amount-each-box-wrapper tmp-hidden">
    <div class="item-wrapper">
        <span class="item-title">項目名：</span><span class="option-text">小盛り</span><span class="option-text-edit"><i class="fas fa-pen"></i></span>
    </div>
    <div class="amount-each-box">
        <span class="title-text">■価格増減：</span><input type="text" class="form-control amount-type-class amount-price-change" placeholder="金額[税込]　（例：[-50]円）"><span class="amount-yen-text">[円]</span><span class="title-text">■量増減：</span><input type="text" class="form-control amount-type-class amount-change" placeholder="内容量の変化 　（例：[-0.5]人前）"><span class="amount-gram-text">[人前]</span>
        <span class="title-text">■原料名：</span><input type="text" class="form-control option-material-textbox" placeholder="この選択をしたときに原料名へ追加する項目があれば記載（例：米、小麦）">
        <br>
    </div>
    <div class="sale-each-box">
        <span class="title-text">■セール価格：</span><input type="text" class="form-control amount-type-class sale-price" value=0 placeholder="増減　（例：[0]円）"><span class="amount-yen-text">[円]</span>
        <div class="sale-checkbox-div">
        <label class="sale-checkbox-label">
            <input class="sale-checkbox" type="checkbox" name="each-sale-price-checkbox-name">セール価格を適用
        </label>
        </div>
        <div class="option-radio">
        <label>
            <input class="option-radio-button" name="default-selection-name-0" type="radio"><span class="option-radio-label">初期選択</span>
        </label>
        </div>
        <div class="delete-option-item-div f-right">
        <img class="delete-option-item" src="images/trash.png" alt="＋画像">
        </div>
    </div>
    </div>
    <div class="amount-each-box-wrapper">
    <div class="item-wrapper">
        <span class="item-title">項目名：</span><span class="option-text">普通</span><span class="option-text-edit"><i class="fas fa-pen"></i></span>
    </div>
    <div class="amount-each-box">
        <span class="title-text">■価格増減：</span><input type="text" id="amount-value-2" class="form-control amount-type-class amount-price-change" value=0 placeholder="金額[税込]　（例：[0]円）"><span class="amount-yen-text">[円]</span><span class="title-text">■量増減：</span><input type="text" class="form-control amount-type-class amount-change" value=0 placeholder="内容量の変化 　（例：[1]人前）"><span class="amount-gram-text">[人前]</span>
        <span class="title-text">■原料名：</span><input type="text" class="form-control option-material-textbox" placeholder="この選択をしたときに原料名へ追加する項目があれば記載（例：米、小麦）">
        <br>
    </div>
    <div class="sale-each-box">
        <span class="title-text">■セール価格：</span><input type="text" class="form-control amount-type-class sale-price" value=0 placeholder="増減　（例：[0]円）"><span class="amount-yen-text">[円]</span>
        <div class="sale-checkbox-div">
        <label class="sale-checkbox-label">
            <input class="sale-checkbox" type="checkbox" name="each-sale-price-checkbox-name">セール価格を適用
        </label>
        </div>
        <div class="option-radio">
        <label>
            <input class="option-radio-button" name="default-selection-name-0" type="radio" checked><span class="option-radio-label">初期選択</span>
        </label>
        </div>
        <div class="delete-option-item-div f-right">
        <img class="delete-option-item" src="images/trash.png" alt="＋画像">
        </div>
    </div>
    </div>
    <div class="amount-each-box-wrapper">
    <div class="item-wrapper">
        <span class="item-title">項目名：</span><span class="option-text">大盛り</span><span class="option-text-edit"><i class="fas fa-pen"></i></span>
    </div>
    <div class="amount-each-box">
        <span class="title-text">■価格増減：</span><input type="text" id="amount-value-3" class="form-control amount-type-class amount-price-change" placeholder="金額[税込]　（例：[-50]円）"><span class="amount-yen-text">[円]</span><span class="title-text">■量増減：</span><input type="text" class="form-control amount-type-class amount-change" placeholder="内容量の変化 　（例：[0.5]人前）"><span class="amount-gram-text">[人前]</span>
        <span class="title-text">■原料名：</span><input type="text" class="form-control option-material-textbox" placeholder="この選択をしたときに原料名へ追加する項目があれば記載（例：米、小麦）">
        <br>
    </div>
    <div class="sale-each-box">
        <span class="title-text">■セール価格：</span><input type="text" class="form-control amount-type-class sale-price" value=0 placeholder="増減　（例：[0]円）"><span class="amount-yen-text">[円]</span>
        <div class="sale-checkbox-div">
        <label class="sale-checkbox-label">
            <input class="sale-checkbox" type="checkbox" name="each-sale-price-checkbox-name">セール価格を適用
        </label>
        </div>
        <div class="option-radio">
        <label>
            <input class="option-radio-button" name="default-selection-name-0" type="radio"><span class="option-radio-label">初期選択</span>
        </label>
        </div>
        <div class="delete-option-item-div f-right">
        <img class="delete-option-item" src="images/trash.png" alt="＋画像">
        </div>
    </div>
    </div>
    <div class="add-option-item-div">
    <button class="add-option-item btn btn-success"><i class="fa fa-plus-circle" aria-hidden="true"></i> 項目追加</button>
    </div>
    </div>
    </div>
    `

    ///===追加するオプションのHTML（サイズ用）
    let option_div_code_size = `\
    <div class="amount-each-box-wrapper">
    <div class="item-wrapper">
    <span class="item-title">項目名：</span><span class="option-text">1_項目名を変更してください</span><span class="option-text-edit"><i class="fas fa-pen"></i></span>
    </div>
    <div class="amount-each-box">
    <span class="title-text">■価格増減：</span><input type="text" class="form-control amount-type-class amount-price-change" placeholder="金額[税込]　（例：[-50]円）"><span class="amount-yen-text">[円]</span><span class="title-text">■量増減：</span><input type="text" class="form-control amount-type-class amount-change" placeholder="内容量の変化 　（例：[-0.5]人前）"><span class="amount-gram-text">[人前]</span>
    <span class="title-text">■原料名：</span><input type="text" class="form-control option-material-textbox" placeholder="この選択をしたときに原料名へ追加する項目があれば記載（例：米、小麦）">
    <br>
    </div>
    <div class="sale-each-box">
    <span class="title-text">■セール価格：</span><input type="text" class="form-control amount-type-class sale-price" value=0 placeholder="増減　（例：[0]円）"><span class="amount-yen-text">[円]</span>
    <div class="sale-checkbox-div">
        <label class="sale-checkbox-label">
        <input class="sale-checkbox" type="checkbox" name="each-sale-price-checkbox-name">セール価格を適用
        </label>
    </div>
    <div class="option-radio">
        <label>
        <input class="option-radio-button" name="default-selection-name-0" type="radio"><span class="option-radio-label">初期選択</span>
        </label>
    </div>
    <div class="delete-option-item-div f-right">
        <img class="delete-option-item" src="images/trash.png" alt="＋画像">
    </div>
    </div>
    </div>
    `;

    ///===追加するオプションのHTML（サイズ以外用）
    let option_div_code_general = `\
    <div class="amount-each-box-wrapper">
    <div class="item-wrapper">
    <span class="item-title">項目名：</span><span class="option-text">1_項目名を変更してください</span><span class="option-text-edit"><i class="fas fa-pen"></i></span>
    </div>
    <div class="amount-each-box">
    <span class="title-text">■価格増減：</span><input type="text" class="form-control amount-type-class amount-price-change" placeholder="金額[税込]　（例：[-50]円）"><span class="amount-yen-text">[円]</span>
    <span class="title-text">■原料名：</span><input type="text" class="form-control option-material-textbox" placeholder="この選択をしたときに原料名へ追加する項目があれば記載（例：米、小麦）">
    <br>
    </div>
    <div class="sale-each-box">
    <span class="title-text">■セール価格：</span><input type="text" class="form-control amount-type-class sale-price" value=0 placeholder="増減　（例：[0]円）"><span class="amount-yen-text">[円]</span>
    <div class="sale-checkbox-div">
        <label class="sale-checkbox-label">
        <input class="sale-checkbox" type="checkbox" name="each-sale-price-checkbox-name">セール価格を適用
        </label>
    </div>
    <div class="option-radio">
        <label>
        <input class="option-radio-button" name="default-selection-name" type="radio"><span class="option-radio-label">初期選択</span>
        </label>
    </div>
    <div class="delete-option-item-div f-right">
        <img class="delete-option-item" src="images/trash.png" alt="＋画像">
    </div>
    </div>
    </div>
    `;

    ///===大項目のdiv
    let bigBoxDiv = `\
    <div class="option-setting-box">
    <div class="option-wrapper">
    <dt class="toggle_title">
        <img class="img-plus-minus img-minus" src="images/minus.png" alt="" >
        <div class="option-name-wrapper">
        <span class="option-title">オプション名：</span><span class="option-text">オプション名を変更してください</span><span class="option-text-edit"><i class="fas fa-pen"></i></span>
        </div>
        <div class="indivisual-setting">
        <label class="multiple-setting-checkbox-label">
            <input class="multiple-checkbox" type="checkbox" name="multiple-checkbox-name">複数選択可能
        </label>
        </div>
        <div class="indivisual-setting">
        <label class="rice-setting-checkbox-label">
            <input class="rice-checkbox" type="checkbox" name="rice-checkbox-name">ご飯の消費量も変わるか
        </label>
        </div>
        <div class="delete-option-item-div f-right">
        <img class="delete-all-option-item" src="images/trash.png" alt="＋画像">
        </div>
    </dt>
    </div>
    <div class="toggle_contents">
    <div class="amount-each-box-wrapper">
    <div class="item-wrapper">
        <span class="item-title">項目名：</span><span class="option-text">項目名を変更してください</span><span class="option-text-edit"><i class="fas fa-pen"></i></span>
    </div>
    <div class="amount-each-box">
        <span class="title-text">■価格増減：</span><input type="text" class="form-control amount-type-class amount-price-change" value=0 placeholder="金額[税込]　（例：[0]円）"><span class="amount-yen-text">[円]</span>
        <span class="title-text">■原料名：</span><input type="text" class="form-control option-material-textbox" placeholder="この選択をしたときに原料名へ追加する項目があれば記載（例：米、小麦）">
        <br>
    </div>
    <div class="sale-each-box">
        <span class="title-text">■セール価格：</span><input type="text" class="form-control amount-type-class sale-price" value=0 placeholder="増減　（例：[0]円）"><span class="amount-yen-text">[円]</span>
        <div class="sale-checkbox-div">
        <label class="sale-checkbox-label">
            <input class="sale-checkbox" type="checkbox" name="each-sale-price-checkbox-name">セール価格を適用
        </label>
        </div>
        <div class="option-radio">
        <label>
            <input class="option-radio-button" name="default-selection-name" type="radio" checked><span class="option-radio-label">初期選択</span>
        </label>
        </div>
        <div class="delete-option-item-div f-right">
        <img class="delete-option-item" src="images/trash.png" alt="＋画像">
        </div>
    </div>
    </div>
    <div class="add-option-item-div">
    <button class="add-option-item btn btn-success"><i class="fa fa-plus-circle" aria-hidden="true"></i> 項目追加</button>
    </div>
    </div>
    </div>
    `

    /// 初めのサイズに関するボックスだけ、ご飯あり、大枠のtrashなし、オプション名の変更なし
    let justSettingFrameDivRice = `\
    <div class="option-setting-box">
    <div class="option-wrapper">
    <dt class="toggle_title">
        <img class="img-plus-minus img-minus" src="images/minus.png" alt="" >
        <div class="option-name-wrapper">
        <span class="option-title">オプション名：</span><span class="option-text">サイズ</span>
        </div>
        <div class="indivisual-setting">
        <label class="multiple-setting-checkbox-label">
            <input class="multiple-checkbox" type="checkbox" name="multiple-checkbox-name" disabled>複数選択可能
        </label>
        </div>
        <div class="indivisual-setting">
        <label class="rice-setting-checkbox-label">
            <input class="rice-checkbox" type="checkbox" name="rice-checkbox-name">ご飯の消費量も変わるか
        </label>
        </div>
        <div class="indivisual-setting">
            <label class="amount-off-setting-checkbox-label">
            <input class="amount-off-checkbox" type="checkbox" name="amount-off-checkbox-name">サイズの変更は不可
            </label>
        </div>
        <!-- <div class="delete-option-item-div f-right">
        <img class="delete-all-option-item" src="images/trash.png" alt="＋画像">
        </div> -->
    </dt>
    </div>
    <div class="toggle_contents">
    <div class="add-option-item-div">
    <button class="add-option-item btn btn-success"><i class="fa fa-plus-circle" aria-hidden="true"></i> 項目追加</button>
    </div>
    </div>
    </div>
    `

    let justSettingFrameDiv = `\
    <div class="option-setting-box">
    <div class="option-wrapper">
    <dt class="toggle_title">
        <img class="img-plus-minus img-minus" src="images/minus.png" alt="" >
        <div class="option-name-wrapper">
        <span class="option-title">オプション名：</span><span class="option-text">サイズ</span><span class="option-text-edit"><i class="fas fa-pen"></i></span>
        </div>
        <div class="indivisual-setting">
        <label class="multiple-setting-checkbox-label">
            <input class="multiple-checkbox" type="checkbox" name="multiple-checkbox-name">複数選択可能
        </label>
        </div>
        <!-- <div class="indivisual-setting">
        <label class="rice-setting-checkbox-label">
            <input class="rice-checkbox" type="checkbox" name="rice-checkbox-name">ご飯の消費量も変わるか
        </label>
        </div> -->
        <div class="delete-option-item-div f-right">
        <img class="delete-all-option-item" src="images/trash.png" alt="＋画像">
        </div>
    </dt>
    </div>
    <div class="toggle_contents">
    <div class="add-option-item-div">
    <button class="add-option-item btn btn-success"><i class="fa fa-plus-circle" aria-hidden="true"></i> 項目追加</button>
    </div>
    </div>
    </div>
    `

    let cropLeft = 0;
    let cropTop = 0;
    let cropWidth = 0;
    let cropHeight = 0;

    $(function () {
        var $image = $('#cropper-img'),
            // height = $image.height() + 4;
            // height = $image.height() + 300;
            width = $image.width()
        //+4: the universal constant!
        height = $image.height() + 4;

        $('.crop-preview-img').css({
            //setting width to $image.width() sets the 
            //starting size to the same as orig image
            width: '100%',
            overflow: 'hidden',
            height: height,
            maxWidth: width,
            maxHeight: height
        });
    });

    /// マイナス値はダミーの値
    let currentCropClickedIndex = -1;

    /// cropper.js
    ///===ドキュメント
    /// github JS版（今回はこちらを使用）
    /// https://github.com/fengyuanchen/cropperjs
    /// github jQuery版（今回は使用していない）
    /// https://github.com/fengyuanchen/jquery-cropper
    /// User
    /// https://cly7796.net/blog/javascript/try-using-cropper-js/

    var cropperImg = document.getElementById('cropper-img');
    let userGlobal = null;
    ///===イベント処理
    /// 
    // cropperImg.addEventListener('', function () {
    //     console.log('');
    //     /// ローディング画面を表示
    //     setLoadingStatus('');
    // });
    /// 準備完了後に実行する処理を関数で設定。初期値はnull。
    cropperImg.addEventListener('ready', function () {
        console.log('ready');
        /// ローディング画面を非表示
        setLoadingStatus('none');

        console.log("cropper : ", cropper);
        console.log("cropLeft : ", cropLeft);
        console.log("cropTop : ", cropTop);
        console.log("cropWidth : ", cropWidth);
        console.log("cropHeight : ", cropHeight);
        // cropper["cropBoxData"]["left"] = 0.16666666666668561;
        // cropper["cropBoxData"]["top"] = 0;
        // cropper["cropBoxData"]["width"] = 312.5333333333333;
        // cropper["cropBoxData"]["height"] = 175.8;
        cropper.setCropBoxData(
            {
                left: cropLeft,
                top: cropTop,
                width: cropWidth,
                height: cropHeight
            }
        );
    });

    let x1 = 0;
    let y1 = 0;
    let width = 0;
    let height = 0;
    // let result;

    const cropper = new Cropper(cropperImg, {
        aspectRatio: 16 / 9,
        // aspectRatio: 1 / 1,
        viewMode: 1,
        preview: '.crop-preview-img',
        /// コンテナをダブルクリックした時に、ドラッグモードを”crop”と”move”で切り替えるかどうかを設定。
        toggleDragModeOnDblclick: false,
        dragMode: "move",
        crop(event) {
            /// クロップ領域を編集した時
            console.log(event.detail.x);
            console.log(event.detail.y);
            console.log(event.detail.width);
            console.log(event.detail.height);
            console.log(event.detail.rotate);
            console.log(event.detail.scaleX);
            console.log(event.detail.scaleY);

            x1 = event.detail.x;
            y1 = event.detail.y;
            width = event.detail.width;
            height = event.detail.height;

            let squareCanvas = $('#preview-square-canvas');
            const canvasCtx = document.getElementById('preview-square-canvas').getContext('2d');
            canvasCtx.clearRect(0, 0, squareCanvas.width(), squareCanvas.height()); // 描画前にクリア
            squareCanvas.css('width', 167);
            squareCanvas.css('height', 167);
            let aspectDiff = width - height
            canvasCtx.drawImage(document.getElementById("cropper-img"), x1 + aspectDiff / 2, y1, width - aspectDiff / 2, height, 0, 0, 400, 150);
        },
    });

    ///===イベント処理
    /// キャンバスまたはトリミングボックスの変更開始時に実行する処理を関数で設定。初期値はnull。
    cropperImg.addEventListener('cropstart', function (e) {
        console.log('cropstart', e);
    });
    /// キャンバスまたはトリミングボックスの変更中に実行する処理を関数で設定。初期値はnull。
    cropperImg.addEventListener('cropmove', function (e) {
        console.log('cropmove', e);
    });
    /// キャンバスまたはトリミングボックスの変更終了時に実行する処理を関数で設定。初期値はnull。
    cropperImg.addEventListener('cropend', function (e) {
        console.log('cropend', e);
        updateIsImageChangeCheck();
    });
    /// キャンバスまたはトリミングボックスが変更された時に実行する処理を関数で設定。初期値はnull。
    cropperImg.addEventListener('crop', function (e) {
        console.log('crop', e);
    });
    /// ズーム時に実行する処理を関数で設定。初期値はnull。
    cropperImg.addEventListener('zoom', function (e) {
        console.log('zoom', e);
    });

    let page_url = location.href;
    ///本番用
    let collection_name = "Restaurant";
    ///テスト用のCollection 
    // let collection_name = "Rest_from_Web";
    ///テスト用のCollection
    // let collection_name = "RestaurantTaga";

    ///順番が変わっていない元のボックス数の配列
    let orgEachTabBox = [1];
    ///各タブの中のボックス数の配列
    let currentEachTabBox = [1];

    ///===initialize
    // resetOption();

    function updateIsImageChangeCheck() {
        document.querySelectorAll('.is-image-change-check')[currentCropClickedIndex].checked = true;
    }

    function updateShapeshift() {
        console.log("updateShapeshift()");
        let activeTabElement = document.getElementsByClassName('ui-state-active')[0];
        console.log("activeTabElement.id : ", activeTabElement.id);

        /// Shapeshiftを更新（これがないと縦に並んでしまったりなど、配置がおかしくなることがあるため）
        $(`#shapeshift_${activeTabElement.id}`).shapeshift();
        // $(`#shapeshift_1`).shapeshift();
        // $(`#shapeshift_2`).shapeshift();
    }
    // let count = 0

    $(function () {
        $(document).on("click", ".img-plus-minus", function () {
            console.log("this : ", $(this));
            console.log("parent.parent.('.toggle_contents')", $(this).parent().parent().children('.toggle_contents'));
            $(this).parent().parent().parent().children('.toggle_contents').toggleClass('option-hidden');

            if ($(this).attr('src') == plusMinusImageArray[0]) {
                $(this).attr('src', plusMinusImageArray[1]);
            } else if ($(this).attr('src') == plusMinusImageArray[1]) {
                $(this).attr('src', plusMinusImageArray[0]);
            }
        });

        /// Shapeshiftを更新（これがないと縦に並んでしまったりなど、配置がおかしくなることがあるため）
        $(document).on("click", ".type-tab", function () {
            // alert("CLASS: XXXがクリックされました。");
            updateShapeshift();
            // count++;
        });

    });

    /// 大項目（量・辛さなどのレベル）の削除ボタン
    $(document).on("click", ".delete-all-option-item", function () {
        console.log("DBG_103");

        let optionIndex = $('.delete-all-option-item').index(this);
        console.log("optionIndex : ", optionIndex);

        swal.fire({
            title: '本当に削除しても良いですか？',
            text: "",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            confirmButtonColor: '#56a764',
            cancelButtonText: 'No',
            cancelButtonColor: '#d33',
        }).then((result) => {
            if (result.isConfirmed) {
                $(".option-setting-box").eq(optionIndex + 1).remove();
                /// Noを選択した時の処理
                Swal.fire(
                    '削除しました',
                    '',
                    'success'
                )
            } else {
                /// Noを選択した時の処理
                Swal.fire(
                    'キャンセルしました',
                    '',
                    'success'
                )
            }
        })
    });
    /// 各項目（大盛り、などのレベル）の削除ボタン
    $(document).on("click", ".delete-option-item", function () {
        console.log("DBG_102");

        let optionIndex = $('.delete-option-item').index(this);
        console.log("optionIndex : ", optionIndex);

        swal.fire({
            title: '本当に削除しても良いですか？',
            text: "",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            confirmButtonColor: '#56a764',
            // showDenyButton: true,
            // denyButtonText: `　B　`,
            // denyButtonColor: '#3688D8',
            // cancelButtonColor: '#d33',
            cancelButtonText: 'No',
            // cancelButtonColor: 'green',
            cancelButtonColor: '#d33',
            // allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                $(".amount-each-box-wrapper").eq(optionIndex).remove();
                /// Noを選択した時の処理
                Swal.fire(
                    '削除しました',
                    '',
                    'success'
                )
            } else {
                /// Noを選択した時の処理
                Swal.fire(
                    'キャンセルしました',
                    '',
                    'success'
                )
            }
        })
    });

    /// 小項目を追加
    $(document).on("click", ".add-option-item", function () {
        console.log("DBG_101");
        let clickedIndex = $('.add-option-item').index(this);
        console.log("clickedIndex : ", clickedIndex);

        /// もしサイズのボックスを追加なら内容量の変化などありのバージョンのボックスを追加
        if (clickedIndex == 0) {
            $(".add-option-item-div").eq(clickedIndex).before(option_div_code_size);
        }
        /// それ以外は内容量の変化などなしのバージョンのボックスを追加
        else {
            $(".add-option-item-div").eq(clickedIndex).before(option_div_code_general);
            /// default-selection-name-xの番号を、今回クリックされたボックスに対して適切な値のものに更新する
            let lastSmallOptionSettingBoxes = document.querySelectorAll('.option-setting-box')[clickedIndex];
            let optionRadioButtons = lastSmallOptionSettingBoxes.querySelectorAll('.option-radio-button');
            console.log("optionRadioButtons : ", optionRadioButtons);
            optionRadioButtons[optionRadioButtons.length - 1].setAttribute('name', `default-selection-name-${clickedIndex}`)
        }

    });

    /// 最後のsetting-box（辛さの大ボックスなど）のnameとデフォルト選択されているラジオボタンを更新
    function updateFinalIsDefaultRadio() {
        let numOfSettingBox = document.querySelectorAll('.option-setting-box').length;
        console.log("document.querySelectorAll('.option-setting-box') : ", document.querySelectorAll('.option-setting-box'));
        let settingBoxes = document.querySelectorAll('.option-setting-box');
        console.log("settingBoxes[0] : ", settingBoxes[0]);
        console.log("settingBoxes[numOfSettingBox - 1] : ", settingBoxes[numOfSettingBox - 1]);
        document.querySelectorAll('.option-setting-box')[numOfSettingBox - 1].querySelectorAll('.option-radio-button')[0].setAttribute('name', `default-selection-name-${numOfSettingBox - 1}`);
        console.log("document.querySelectorAll('.option-setting-box')[numOfSettingBox - 1] : ", document.querySelectorAll('.option-setting-box')[numOfSettingBox - 1]);
        document.querySelectorAll('.option-setting-box')[numOfSettingBox - 1].querySelectorAll('.option-radio-button')[0].checked = true;
    }

    /// 大項目を追加
    $(document).on("click", "#add-other-option-set", function () {
        // console.log("DBG_103");
        // let optionIndex = $('.add-option-item').index(this);
        // // console.log("$('.add-option-item').index(this) : ", $('.add-option-item').index(this));
        // console.log("optionIndex : " , optionIndex);
        // alert("大項目optionIndex : ", optionIndex);

        /// 設定の数を数える
        let optionAllSettingBox = document.getElementById("option-all-setting-box");

        console.log("document.querySelectorAll('.option-setting-box').length : ", document.querySelectorAll('.option-setting-box').length);
        let numOfBigItem = document.querySelectorAll('.option-setting-box').length;
        if (numOfBigItem == 0) {
            optionAllSettingBox.insertAdjacentHTML('beforeend', justSettingFrameDivRice);
        }
        else {
            optionAllSettingBox.insertAdjacentHTML('beforeend', bigBoxDiv);
            updateFinalIsDefaultRadio()
        }
    });

    function object_array_sort(data, key, order, fn) {
        //デフォは降順(DESC)
        let num_a = -1;
        let num_b = 1;

        if (order === 'asc') { //指定があれば昇順(ASC)
            num_a = 1;
            num_b = -1;
        }

        data = data.sort(function (a, b) {
            let x = a[key];
            let y = b[key];
            if (x > y) return num_a;
            if (x < y) return num_b;
            return 0;
        });

        fn(data); // ソート後の配列を返す
    }

    function setLoadingStatus(status) {
        let loading = document.getElementById('loading');
        loading.style.display = status;

        ///===使用方法
        // /// ローディングを表示
        // setLoadingStatus('');
        // /// ローディング画面を非表示
        // setLoadingStatus('none');
    }

    function addMenuBox(tabIndex) {
        /// tabIndexは0, 1, 2〜
        // let tabIndex = $('.add-button').index(this);
        // console.log("$('.add-button').index(this) : ", $('.add-button').index(this));
        $(`#shapeshift_${tabIndex + 1}`).append(menu_div_code);
        $(`#shapeshift_${tabIndex + 1}`).shapeshift();
        updateMenuOptionAction();
        orgEachTabBox[tabIndex] = orgEachTabBox[tabIndex] + 1;
        addToppingOption();
    }

    function extractEachRichMenus(type_orderElement, docData, tabIndex) {
        console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■extractEachRichMenus");
        console.log("DBG3_docData : ", docData);

        let addCount = 0;

        if (true) {
            console.log("All menu : ", docData["menu_map"]);
            /// まずtypeが今回対象のもののオブジェクトのみの配列を生成する
            // let tmpTargetTypeArray = [];
            // let typeFilteredData = [];
            ///=== 各メニューデータをDBからフォームへ入力
            if (docData["menu_map"]) {
                docData["menu_map"].forEach(function (thisTimeMenuData, menuMapIndex) {
                    console.log("menuMapIndex : ", menuMapIndex);
                    console.log("thisTimeMenuData : ", thisTimeMenuData);

                    // メニュー名がmapのキーの時の実装
                    // let menuName = Object.keys(thisTimeMenuData)[0];
                    let menuName = thisTimeMenuData['menu_name'];
                    // console.log("thisTimeMenuData[menuName][type] : ", thisTimeMenuData[menuName]["type"]);
                    console.log("menuName : ", menuName);

                    // /// 今回のメニューのタブ名が、今対象としているタブのメニューだったら
                    if (thisTimeMenuData["type"] == type_orderElement["title"]) {
                        // let currentShapeshiftId = "shapeshift_2";
                        let currentShapeshiftId = `shapeshift_${tabIndex + 1}`;
                        let currentShapeshiftElement = document.getElementById(currentShapeshiftId);
                        console.log(`addCount : ${addCount}のメニューを追加`);
                        if (addCount == 0) {
                            /// 初めのBOXはもうあるので追加はしない
                        } else {
                            /// メニューがある分BOXを追加する
                            addMenuBox(tabIndex);
                        }

                        ///---中身を入れていく
                        /// 追加したBOXにDBからメニューを入れていく（ここで回るのは１つのタブの中の各BOX）
                        // for( let j=0; j < currentShapeshiftElement.children.length; j++) {
                        // console.log("■■■■■■■■■currentShapeshiftElement");
                        ///=== menu-divsの1個目〜
                        console.log(`menu-divsの${addCount + 1}個目〜`);
                        // console.log("currentShapeshiftElement.children[j] : " , currentShapeshiftElement.children[j]);
                        console.log("currentShapeshiftElement.children[addCount] : ", currentShapeshiftElement.children[addCount]);
                        ///===商品名
                        console.log(`***from DB 商品名`);
                        // currentShapeshiftElement.children[j].querySelector('.item-name').innerText = `DBG${j}`;
                        console.log("menuName : ", menuName);
                        // currentShapeshiftElement.children[addCount].querySelector('.item-name').innerText = thisTimeMenuData["menu_name"];
                        currentShapeshiftElement.children[addCount].querySelector('.item-name').innerText = menuName;
                        ///===金額
                        console.log(`***from DB 金額`);
                        // currentShapeshiftElement.children[addCount].querySelector('.item-value').innerText = thisTimeMenuData["data"]["price"];
                        currentShapeshiftElement.children[addCount].querySelector('.item-value').innerText = thisTimeMenuData["price"];
                        ///===商品説明
                        console.log(`***from DB 商品説明`);
                        // currentShapeshiftElement.children[addCount].querySelector('.item-description').innerText = thisTimeMenuData["data"]["description"];
                        // currentShapeshiftElement.children[addCount].querySelector('.item-description-all-show').innerText = thisTimeMenuData["data"]["description"];
                        currentShapeshiftElement.children[addCount].querySelector('.item-description').innerText = thisTimeMenuData["description"];
                        currentShapeshiftElement.children[addCount].querySelector('.item-description-all-show').innerText = thisTimeMenuData["description"];
                        ///===原材料
                        console.log(`***from DB 原材料`);
                        currentShapeshiftElement.children[addCount].querySelector('.ingredients').innerText = thisTimeMenuData["ingredient_list"];
                        currentShapeshiftElement.children[addCount].querySelector('.ingredients-all-show').innerText = thisTimeMenuData["ingredient_list"];
                        ///===アレルゲン
                        console.log(`***from DB アレルゲン`);
                        console.log("allergen : ", thisTimeMenuData["allergen"]);
                        // let allergenArray = thisTimeMenuData["allergen"].split('・');
                        let allergenArray = thisTimeMenuData["allergen"];
                        console.log("allergenArray : ", allergenArray);

                        let allergenCheckBoxes = currentShapeshiftElement.children[addCount].querySelector('.allergen').querySelectorAll('.allergen-check')
                        let allergenShowCheckBoxes = currentShapeshiftElement.children[addCount].querySelector('.allergen-all-show').querySelectorAll('.allergen-check-show')
                        console.log("allergenCheckBoxes : ", allergenCheckBoxes);

                        for (i = 0; i < allergenCheckBoxes.length; i++) {
                            console.log("今回対象のアレルゲンallergenListArray[i] : ", allergenListArray[i]);
                            /// DBのデータによってここの各アレルギーのチェックボックスのT/Fを変える。
                            if (allergenArray.includes(allergenListArray[i])) {
                                console.log(`${allergenListArray[i]}を含む`);
                                allergenCheckBoxes[i].checked = true;
                                allergenShowCheckBoxes[i].checked = true;
                            } else {
                                console.log(`${allergenListArray[i]}を含まない`);
                                allergenCheckBoxes[i].checked = false;
                                allergenShowCheckBoxes[i].checked = false;
                            }
                        }

                        // ///===辛さの選択可能か
                        // console.log(`***from DB 辛さの選択可能か`);
                        // console.log("辛さ選択はあるか？ : " , thisTimeMenuData["options"].includes("spiciness"));
                        // if (thisTimeMenuData["options"].includes("spiciness")) {
                        //     currentShapeshiftElement.children[addCount].querySelector('.spiciness').innerText = "Yes";                
                        // }
                        // else {
                        //     currentShapeshiftElement.children[addCount].querySelector('.spiciness').innerText = "No";                
                        // }

                        // ///===量の選択可能か
                        // console.log(`***from DB 量の選択可能か`);
                        // console.log("量選択はあるか？ : " , thisTimeMenuData["options"].includes("amount"));
                        // if (thisTimeMenuData["options"].includes("amount")) {
                        //     currentShapeshiftElement.children[addCount].querySelector('.amount').innerText = "Yes";                
                        // }
                        // else {
                        //     currentShapeshiftElement.children[addCount].querySelector('.amount').innerText = "No";                
                        // }

                        ///===オプション
                        console.log(`***from DB オプション`);
                        if (thisTimeMenuData["options"][0] != undefined) {
                            // thisTimeMenuData["contents_gram"]
                            console.log("options : ", thisTimeMenuData["options"]);
                            console.log("options[0] : ", thisTimeMenuData["options"][0]);
                            console.log("options[0][choices] : ", thisTimeMenuData["options"][0]["choices"]);
                            console.log("options[0][choices][0] : ", thisTimeMenuData["options"][0]["choices"][0]);
                            // console.log("options[0][choices][0][recommended] : " , thisTimeMenuData["options"][0]["choices"][0]["recommended"]);
                            // console.log("options[0][choices][recommended]: " , thisTimeMenuData["options"][0]["choices"]["recommended"]);

                            /// 
                            let targetToppingObj = {};
                            // let targetGeneralOptionObj = {};

                            let generalOptionStr = "";
                            ///ポップアップウィンドウへ入れる文字
                            let generalOptionShowStr = "";

                            /// トッピング、サイズ、辛さ、などのループ
                            /// choices -> optionDescriptionが""トッピング"かどうかを判定した上でここからのトッピングについての処理を行う
                            thisTimeMenuData["options"].forEach(function (optionsElement, optionsIndex) {
                                console.log("optionsIndex : ", optionsIndex);
                                console.log("optionsElement : ", optionsElement);

                                ///===サイズや辛さなど、他のオプションではなく、トッピングオプションについて処理を行う
                                if (optionsElement["option_description"] == "トッピング") {
                                    console.log("---トッピング from DB");
                                    optionsElement["choices"].forEach(function (choicesElement, choicesIndex) {
                                        console.log("トッピング_choicesIndex : ", choicesIndex);
                                        console.log("トッピング_choicesElement : ", choicesElement);
                                        console.log("トッピング_choicesElement[recommended] : ", choicesElement["recommended"]);
                                        console.log("トッピング_choicesElement[select_description] : ", choicesElement["select_description"]);
                                        targetToppingObj[choicesElement["select_description"]] =
                                        {
                                            recommended: choicesElement["recommended"],
                                        }

                                        /// ここで初期状態のトッピング情報を記録する
                                        console.log("===DBG_for_getting_initial_Topping_list");
                                        console.log("choicesElement['select_description'] : ", choicesElement["select_description"]);
                                        initialToppingList.push(choicesElement["select_description"]);

                                    });
                                    /// Check the call times
                                    console.log("initialToppingList : ", initialToppingList);
                                    console.log("targetToppingObj : ", targetToppingObj);


                                    let toppingStr = "";
                                    ///ポップアップウィンドウへ入れる文字
                                    let toppingShowStr = "";
                                    $(".topping-item").each(function (toppingItemCount, obj) {
                                        console.log('DB Extract インデックス番号:' + toppingItemCount + '、テキスト:' + $(obj).text());
                                        // if (thisTimeMenuData["can_be_topped"].includes($(obj).text())) {

                                        // }

                                        /// 商品名のチェック用テキスト
                                        let toppingItemChekckText = "";
                                        /// 商品名のチェック用テキスト
                                        let toppingIemRecommendChekckText = "";

                                        console.log(" targetToppingObj[$(obj).text()] : ", targetToppingObj[$(obj).text()]);
                                        if (targetToppingObj[$(obj).text()] == undefined) {
                                            /// トッピングチェックなし
                                            console.log(`${$(obj).text()}：なし`);
                                            toppingItemChekckText = "";
                                            toppingIemRecommendChekckText = "";
                                        } else {
                                            /// トッピングチェックあり
                                            console.log(`${$(obj).text()}：あり`);
                                            toppingItemChekckText = "checked";
                                            if (targetToppingObj[$(obj).text()]["recommended"]) {
                                                toppingIemRecommendChekckText = "checked";
                                            }
                                            else {
                                                toppingIemRecommendChekckText = "";
                                            }
                                        }

                                        /// フロントのメニューボックスへの挿入用のHTML生成処理
                                        toppingStr = toppingStr +
                                            `
                                            <div class="topping-front-one-set">
                                                <label class="">
                                                    <input type="checkbox" class="topping-check hidden-org-checkbox" disabled="disabled" name='' ${toppingItemChekckText}><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-topping">${$(obj).text()}</span>
                                                </label>
                                                <label class="">
                                                    <input type="checkbox" class="topping-recommend-check hidden-org-checkbox" disabled="disabled" name='' ${toppingIemRecommendChekckText}><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-topping-reccomend">おすすめ！</span>
                                                </label>
                                            </div>
                                            `;

                                        toppingShowStr = toppingShowStr +
                                            `
                                            <div class="topping-front-one-set">
                                                <label class="">
                                                    <input type="checkbox" class="topping-check-show hidden-org-checkbox" disabled="disabled" name='' ${toppingItemChekckText}><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-topping">${$(obj).text()}</span>
                                                </label>
                                                <label class="">
                                                    <input type="checkbox" class="topping-recommend-check-show hidden-org-checkbox" disabled="disabled" name='' ${toppingIemRecommendChekckText}><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-topping-reccomend">おすすめ！</span>
                                                </label>
                                            </div>
                                            `;
                                    });
                                    currentShapeshiftElement.querySelectorAll('.topping')[addCount].innerHTML = toppingStr;
                                    currentShapeshiftElement.querySelectorAll('.topping-all-show')[addCount].innerHTML = toppingShowStr;
                                }
                                ///===トッピング以外の汎用オプション
                                else {
                                    console.log("---汎用オプション from DB");
                                    console.log("options : ", thisTimeMenuData["options"]);

                                    $("#form-general-option").empty();

                                    let targetGeneralOptionObj = {};

                                    /// TODO: ↓現状はここで全てに、空の状態のトッピングリストを入れているが、既存の情報を読んで比較することによって、
                                    /// 元のデータを保持して差分のみを追加するような形にできるとbetter

                                    console.log("DBG6_option-setting-box : ", document.querySelectorAll('.option-setting-box'));
                                    /// -> サイズ、辛さ、硬さ、などの大項目のリスト

                                    console.log("optionsElement : ", optionsElement);
                                    console.log("optionsElement['choices'] : ", optionsElement["choices"]);
                                    /// オプションのオブジェクト生成
                                    optionsElement["choices"].forEach(function (choicesElement, choicesIndex) {
                                        console.log("汎用オプション choicesIndex : ", choicesIndex);
                                        console.log("汎用オプション choicesElement : ", choicesElement);
                                        console.log("汎用オプション choicesElement[recommended] : ", choicesElement["recommended"]);
                                        console.log("汎用オプション choicesElement[select_description] : ", choicesElement["select_description"]);
                                        targetGeneralOptionObj[choicesElement["select_description"]] =
                                        {
                                            recommended: choicesElement["recommended"],
                                        }
                                        // targetGeneralOptionObj["サイズ"] = {
                                        // [choicesElement["select_description"]] :
                                        //     {
                                        //         recommended : choicesElement["recommended"],
                                        //     }
                                        // }
                                    });
                                    console.log("targetGeneralOptionObj : ", targetGeneralOptionObj);

                                    // let generalOptionStr = "";
                                    // ///ポップアップウィンドウへ入れる文字
                                    // let generalOptionShowStr = "";


                                    /// サイズ、辛さ、麺の硬さなど
                                    document.querySelectorAll('.option-setting-box').forEach((p, optionSettingBoxIndex) => {
                                        console.log("optionSettingBoxIndex : ", optionSettingBoxIndex);
                                        console.log("document.querySelectorAll('.option-setting-box')[optionSettingBoxIndex] : ", document.querySelectorAll('.option-setting-box')[optionSettingBoxIndex]);

                                        console.log("DBG_option-title : ", document.querySelectorAll('.option-setting-box')[optionSettingBoxIndex].querySelectorAll('.option-text'));
                                        console.log("DBG_option-title[0] : ", document.querySelectorAll('.option-setting-box')[optionSettingBoxIndex].querySelectorAll('.option-text')[0]);

                                        console.log("DBG7_option-setting-box : ", document.querySelectorAll('.option-setting-box')[optionSettingBoxIndex].querySelectorAll('.option-text'));


                                        ///===
                                        // let eachSmallOptions = document.querySelectorAll('.option-setting-box')[optionSettingBoxIndex].querySelectorAll('.option-text');
                                        let eachSmallOptions = document.querySelectorAll('.option-setting-box')[optionSettingBoxIndex].querySelectorAll('.option-text');
                                        // eachSmallOptions

                                        let smallOptionArrayThisTime = [];
                                        /// 今回のグループのオプションの配列を作成（あとでこれと見比べて関係ないグループのオプションは追加しないようにする　（これを行わないと、サイズ、辛さ、硬さなどがループの分だけ複数個できてしまう）
                                        eachSmallOptions.forEach((p, eachSmallOptionIndex) => {
                                            smallOptionArrayThisTime.push(eachSmallOptions[eachSmallOptionIndex].innerText);
                                        });

                                        // console.log("smallOptionArrayThisTime : " , smallOptionArrayThisTime);
                                        // dbgCount++;

                                        // console.log("dbgCount : " , dbgCount);
                                        /// 例：小盛り、などを、フロントのオプションリストで回して、DBのデータから読んだリスト（targetGeneralOptionObj）と比較して、あるものはチェックを入れる。
                                        console.log("eachSmallOptions : ", eachSmallOptions);
                                        ///===DBから読み込んだoptionのループの中で、フロントの全オプションのループを回す。今回対象でない、冗長な部分が出てくるので大項目が一致しているかどうかで弾く。
                                        eachSmallOptions.forEach((p, eachSmallOptionIndex) => {
                                            console.log("eachSmallOptionIndex : ", eachSmallOptionIndex);
                                            console.log("eachSmallOptions[eachSmallOptionIndex] : ", eachSmallOptions[eachSmallOptionIndex]);
                                            console.log("eachSmallOptions[eachSmallOptionIndex].innerText : ", eachSmallOptions[eachSmallOptionIndex].innerText);
                                            let smallOptionName = eachSmallOptions[eachSmallOptionIndex].innerText;
                                            /// -> 例：小盛り、など
                                            console.log("smallOptionArrayThisTime : ", smallOptionArrayThisTime);
                                            console.log("smallOptionName : ", smallOptionName);
                                            // if (!smallOptionArrayThisTime.includes(smallOptionName)) {
                                            //     console.log("今回のグループのオプションじゃないのでスキップ");
                                            //     // break;
                                            // }
                                            // else {
                                            console.log("今回のグループのオプションなのででスキップしない");
                                            /// 商品名のチェック用テキスト
                                            let generalOptionItemChekckText = "";
                                            /// 商品名のチェック用テキスト
                                            let generalOptionIemRecommendChekckText = "";

                                            console.log("=========DBG_1007_menuName : ", menuName);

                                            /// オプション名（大項目）例；「サイズ」
                                            if (eachSmallOptionIndex == 0) {
                                                /// 例：サイズ
                                                optionTitle = eachSmallOptions[eachSmallOptionIndex].innerText;
                                                console.log("DBG1000_optionTitle : ", optionTitle);
                                            }
                                            /// それぞれのオプション名（小ｊ項目）例；「小盛り、普通」
                                            else {
                                                if (optionTitle != optionsElement["option_description"]) {
                                                    console.log("もし対象のグループ（大項目）でなければスキップ");
                                                }
                                                /// 対象のだったら
                                                else {
                                                    // eachSmallOptions[eachSmallOptionIndex].innerText
                                                    console.log("■ーーーDBG8");
                                                    // console.log("targetGeneralOptionObj : " , targetGeneralOptionObj);
                                                    /// 初めだけdivをヘッダーとして追加
                                                    if (eachSmallOptionIndex == 1) {
                                                        // sizeStr = sizeStr + optionTitle;
                                                        generalOptionStr = generalOptionStr + `<div class="inner-box-option-title-div" >ーーー<span class="inner-box-option-title">${optionTitle}</span>`;
                                                        generalOptionShowStr = generalOptionShowStr + `<div class="inner-box-option-title-div-show" >ーーー<span class="inner-box-option-title">${optionTitle}</span>`;
                                                    }

                                                    // console.log(" targetGeneralOptionObj[$(optionTitle)] : " ,  targetGeneralOptionObj[$(optionTitle)]);
                                                    console.log("DBG_1001_targetGeneralOptionObj : ", targetGeneralOptionObj);
                                                    console.log("targetGeneralOptionObj[smallOptionName] : ", targetGeneralOptionObj[smallOptionName]);
                                                    console.log("targetGeneralOptionObj['大盛り'] : ", targetGeneralOptionObj['大盛り']);
                                                    // console.log("targetGeneralOptionObj.keys('からい') : " ,  targetGeneralOptionObj.keys('からい'));
                                                    // console.log("targetGeneralOptionObj. : " ,  targetGeneralOptionObj("からい"));
                                                    console.log("DBG_1002_targetGeneralOptionObj[smallOptionName] : ", targetGeneralOptionObj[smallOptionName]);
                                                    console.log("DBG_1003_targetGeneralOptionObj[$(smallOptionName)] : ", targetGeneralOptionObj[$(smallOptionName)]);
                                                    console.log("DBG_1006_thisTimeMenuData : ", thisTimeMenuData);

                                                    console.log("DBG_1008_smallOptionName : ", smallOptionName);
                                                    console.log("DBG_1009_targetGeneralOptionObj : ", targetGeneralOptionObj);

                                                    /// 今回対象のスモールオプション（小盛りなど）が今回対象の大項目（サイズなど）に含まれていないときはスキップ（例：スモールオプションが甘口なのに。大項目optionsElement["option_description"]がサイズなど）

                                                    // if () {}
                                                    if (targetGeneralOptionObj[smallOptionName] == undefined) {
                                                        /// チェックなし
                                                        console.log(`${$(smallOptionName)}：なし`);
                                                        generalOptionItemChekckText = "";
                                                        generalOptionIemRecommendChekckText = "";
                                                    } else {
                                                        /// チェックあり
                                                        console.log(`${$(smallOptionName)}：あり`);
                                                        generalOptionItemChekckText = "checked";
                                                        if (targetGeneralOptionObj[smallOptionName]["recommended"]) {
                                                            generalOptionIemRecommendChekckText = "checked";
                                                        }
                                                        else {
                                                            generalOptionIemRecommendChekckText = "";
                                                        }
                                                    }


                                                    /// -> サイズ、辛さ、硬さ・・・のレイヤーで回る（この場合要素（ループ）は３つ）
                                                    generalOptionStr = generalOptionStr +
                                                        `
                                                            <div class="general-option-front-one-set">
                                                                <label class="">
                                                                    <input type="checkbox" class="general-option-check hidden-org-checkbox" disabled="disabled" name='' ${generalOptionItemChekckText}><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-option">${eachSmallOptions[eachSmallOptionIndex].innerText}</span>
                                                                </label>
                                                                <label class="">
                                                                    <input type="checkbox" class="general-option-recommend-check hidden-org-checkbox" disabled="disabled" name='' ${generalOptionIemRecommendChekckText}><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-option-reccomend">おすすめ！</span>
                                                                </label>
                                                            </div>
                                                            `;

                                                    generalOptionShowStr = generalOptionShowStr +
                                                        `
                                                            <div class="general-option-front-one-set">
                                                                <label class="">
                                                                    <input type="checkbox" class="general-option-check-show hidden-org-checkbox" disabled="disabled" name='' ${generalOptionItemChekckText}><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-option">${eachSmallOptions[eachSmallOptionIndex].innerText}</span>
                                                                </label>
                                                                <label class="">
                                                                    <input type="checkbox" class="general-option-recommend-check-show hidden-org-checkbox" disabled="disabled" name='' ${generalOptionIemRecommendChekckText}><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-option-reccomend">おすすめ！</span>
                                                                </label>
                                                            </div>
                                                            `;

                                                    /// 最後に</div>を追加
                                                    /// TODO : DOM操作に変更する
                                                    if (eachSmallOptionIndex + 1 == eachSmallOptions.length) {
                                                        generalOptionStr = generalOptionStr + `</div>`;
                                                        generalOptionShowStr = generalOptionShowStr + `</div>`;
                                                    }
                                                }

                                                // console.log("generalOptionStr : " , generalOptionStr);
                                            }
                                            // }
                                        });

                                    });
                                    /// １つのオプションが終わったらフロントのボックスに入れる項目を一つ作成
                                    // generalOptionStr = "DBGDBGDBG"
                                    // console.log("DBG_13_generalOptionStr : " , generalOptionStr);
                                    console.log("Fin");
                                    // console.log("DBG_13_generalOptionStr : " , generalOptionStr);
                                    currentShapeshiftElement.querySelectorAll('.general-option')[addCount].innerHTML = generalOptionStr;
                                    currentShapeshiftElement.querySelectorAll('.general-option-all-show')[addCount].innerHTML = generalOptionShowStr;
                                }
                            });
                        }

                        ///===セール情報
                        console.log(`***from DB セール情報`);
                        currentShapeshiftElement.children[addCount].querySelector('.food-sale-price-value').innerText = thisTimeMenuData["sale_price"];
                        currentShapeshiftElement.children[addCount].querySelector('.food-sale-price-check').checked = thisTimeMenuData["is_sale"];

                        ///===ご飯が含まれるかどうかのチェックボックスの情報
                        console.log("All : ", thisTimeMenuData);
                        console.log("consumption : ", thisTimeMenuData["consumptions"]);
                        /// consumptionsにご飯（"rice"）が含まれるかどうかのフラグ
                        let isContainRice = false;
                        thisTimeMenuData["consumptions"].forEach(function (consumptionElement, consumptionIndex) {
                            console.log("consumptionIndex : ", consumptionIndex);
                            console.log("consumptionElement : ", consumptionElement);
                            console.log("consumptionElement[stock_selection] : ", consumptionElement["stock_selection"]);
                            if (consumptionElement["stock_selection"] == "rice") {
                                isContainRice = true;
                            }
                        });
                        currentShapeshiftElement.children[addCount].querySelector('.contain-rice-check').checked = isContainRice;

                        ///===おすすめメニューチェックボックス
                        currentShapeshiftElement.children[addCount].querySelector('.recommended-menu-check').checked = thisTimeMenuData["recommended_menu"];
                        ///=== 表示/非表示(isShow)のチェックボックス
                        let isShow = thisTimeMenuData["is_show"]
                        // console.log("DBG_1_currentShapeshiftElement : " , currentShapeshiftElement);
                        // console.log("DBG_1.5_currentShapeshiftElement.children : " , currentShapeshiftElement.children);
                        // console.log("DBG_1.6_currentShapeshiftElement.children[addCount].querySelector('.menu-divs') : " , currentShapeshiftElement.children[addCount].querySelector('.menu-divs'));
                        // // console.log("DBG_1.6_currentShapeshiftElement.children[addCount].querySelector('.menu-divs') : " , currentShapeshiftElement.children[addCount].querySelector('.menu-divs'));
                        // console.log("DBG_2_currentShapeshiftElement.children[addCount] : " , currentShapeshiftElement.children[addCount]);
                        // console.log("DBG_3_currentShapeshiftElement.children[addCount].querySelector('.menu-divs') : " , currentShapeshiftElement.children[addCount].querySelector('.menu-divs'));
                        // console.log("DBG_4_currentShapeshiftElement.children[addCount].children : " , currentShapeshiftElement.children[addCount].children);
                        // console.log("DBG_5_currentShapeshiftElement.children[addCount].querySelector('.is-show-check').parentNode : " , currentShapeshiftElement.children[addCount].querySelector('.is-show-check').parentNode);
                        currentShapeshiftElement.children[addCount].querySelector('.is-show-check').checked = isShow;
                        /// 表示設定のとき
                        if (isShow) {
                            /// menu-divsのdivに対して表示/非表示を切り替える
                            currentShapeshiftElement.children[addCount].classList.remove("not-shown");;
                            currentShapeshiftElement.children[addCount].querySelector('.is-show-img').src = "images/show.png";
                        }
                        /// 非表示設定の時
                        else {
                            /// menu-divsのdivに対して表示/非表示を切り替える
                            currentShapeshiftElement.children[addCount].classList.add("not-shown");
                            currentShapeshiftElement.children[addCount].querySelector('.is-show-img').src = "images/hide.png";

                        }

                        ///===内容量
                        console.log(`***from DB 内容量`);
                        currentShapeshiftElement.children[addCount].querySelector('.contents-gram-value').innerText = thisTimeMenuData["contents_gram"];
                        ///===保存方法
                        console.log(`***from DB 保存方法`);
                        /// 常に見えている保存方法のテキスト
                        currentShapeshiftElement.children[addCount].querySelector('.preservation-expiration').innerHTML =
                            `
                            <span class="preservation-num">${thisTimeMenuData["preservation"]["number"]}</span>
                            <span class="preservation-text">.${thisTimeMenuData["preservation"]["text"]}</span>
                            `
                        /// マウスオーバーした時の保存方法のテキスト
                        currentShapeshiftElement.children[addCount].querySelector('.preservation-expiration-all-show').innerHTML =
                            `
                            <span class="preservation-num-all-show">${thisTimeMenuData["preservation"]["number"]}</span>
                            <span class="preservation-text-num-all-show">.${thisTimeMenuData["preservation"]["text"]}</span>
                            `

                        ///===画像
                        console.log(`***from DB 画像`);
                        console.log("画像URL : ", thisTimeMenuData["img_path"]);
                        /// 画像に入れ込み（表示のみ）
                        currentShapeshiftElement.children[addCount].querySelector('.test_food_img').src = thisTimeMenuData["img_path"];
                        /// img-url-textのUIにDBの画像URLを記録する（これを元に画像送信時にDBに画像が登録済みかどうかを判断をする。）
                        currentShapeshiftElement.children[addCount].querySelector('.img-url-text').innerText = thisTimeMenuData["img_path"];
                        if (thisTimeMenuData["img_info"]) {
                            currentShapeshiftElement.children[addCount].querySelector('.org-menu-image').src = thisTimeMenuData["img_info"]["org_img_url"];
                            currentShapeshiftElement.children[addCount].querySelector('.org-img-url-text').innerText = thisTimeMenuData["img_info"]["org_img_url"];

                            console.log("DBG_1 : ", thisTimeMenuData["img_info"]);
                            if ("crop_area" in thisTimeMenuData["img_info"]) {
                                console.log("cropAreaあり");
                                //orangeというキーが存在する場合の処理
                                // console.log(fruits.orange.price)
                            } else {
                                console.log("cropAreaなし");
                                //orangeというキーが存在しない場合の処理
                                // console.log("orangeの情報がありません")
                            }

                            // console.log("crop_area : ", thisTimeMenuData["img_info"]["crop_area"]);
                            ///===クロップ領域情報の設定
                            if (thisTimeMenuData["img_info"]["crop_area"] != undefined) {
                                currentShapeshiftElement.children[addCount].querySelector('.crop-left').dataset.left = thisTimeMenuData["img_info"]["crop_area"]["left"];
                                currentShapeshiftElement.children[addCount].querySelector('.crop-top').dataset.top = thisTimeMenuData["img_info"]["crop_area"]["top"];
                                currentShapeshiftElement.children[addCount].querySelector('.crop-width').dataset.width = thisTimeMenuData["img_info"]["crop_area"]["width"];
                                currentShapeshiftElement.children[addCount].querySelector('.crop-height').dataset.height = thisTimeMenuData["img_info"]["crop_area"]["height"];
                            }
                        }
                        addCount++;
                    }
                });
                // return;
            } else {
                console.log("menu_mapデータなし");
            }
        }
    }

    /// タブを生成
    function extracttype_order(type_orderElement, docData, tabIndex) {
        //code to insert new tab here if tab name does not exist  
        // if (!tabNameExists) { 
        // Here we are getting max id so that we can assing new id to new tab  
        /// 登録できるタブの最大数
        let maxTabNum = 5;
        let maxid = 0;
        $('#menu-tabs ul li').each(function () {
            let value = parseInt($(this).attr('id'));
            maxid = (value > maxid) ? value : maxid;
        });


        /// 初めは元々１つ出ているタブを使う
        if (tabIndex == 0) {
            document.getElementById('tab1').innerText = type_orderElement["title"];
        } else {
            let newid = maxid + 1;

            /// タブの数を制限する場合
            if (maxid >= maxTabNum) {
                alert(`タブの数は最大${maxTabNum}個までです。`)
                return;
            }

            console.log("newid : ", newid);
            let shapeshift_id = "shapeshift_" + String(newid);
            console.log("shapeshift_id : ", shapeshift_id);
            console.log(`<div id="${shapeshift_id}">`);

            let generate_sentence =
                `\
                    <div id="${shapeshift_id}">\
                        ${menu_div_code}\
                    </div>\
                    <button class="btn add-button menu-add btn btn-success"><i class="fa fa-plus-circle" aria-hidden="true"></i> メニュー追加</button>
                `

            ///タブ自体
            $("#menu-tabs ul").append(
                `
                <li id="${newid}" class="type-tab"><a href="#tab-${newid}"><span id="tab${newid}" class="change-target">${type_orderElement["title"]}</span><span class="tab-edit"><i class="fas fa-pen"></i></span></a></li>
                `
            );

            ///タブの中身
            $("#menu-tabs").append(
                "<div style='display:none;' id='tab-" + newid + "'>" +
                generate_sentence +
                "</div>"
            );

            // ///タブの中身
            // $("#menu-tabs").append(  
            //     ""
            // );

            // Refreshing the tab as we have just added new tab  
            $("#menu-tabs").tabs("refresh");
            // Make added tab active  
            $("#menu-tabs").find('li a[href="#tab-' + newid + '"]').trigger("click");
            // $("#divDialog").dialog("close");  

            // 更新
            $("#" + shapeshift_id).shapeshift();
            // $("#shapeshift_1").shapeshift();
            // alert("タブを追加");

            ///各タブのボックス数を表す配列に１項目追加（初期はボックスが1個なので中身は1）
            orgEachTabBox.push(1);
            addToppingOption();
            updateMenuOptionAction();
        }

        /// 各メニューデータをDBからフォームへ抽出する
        // extractEachMenus(type_orderElement, docData, tabIndex);
        extractEachRichMenus(type_orderElement, docData, tabIndex);
    }

    function numberingIsDefaultRadio() {
        document.querySelectorAll('.option-setting-box')
            .forEach(function (settingElement, Index) {
                console.log("ーーーーーーsettingElement");
                console.log("Index : ", Index);
                console.log("settingElement : ", settingElement);
                settingElement.querySelectorAll('.option-radio-button').forEach(function (radioElement, radioIndex) {
                    console.log("ーーーradioElement");
                    console.log("radioIndex : ", radioIndex);
                    console.log("radioElement : ", radioElement);
                    // radioElement.attr('name', 'new-user');
                    console.log("radioElement.checked : ", radioElement.checked);
                    radioElement.setAttribute('name', `default-selection-name-${Index}`);
                    // if (radioIndex == 2){
                    //     console.log("チェックする");
                    //     radioElement.checked = true;
                    // }
                });
            });

    }

    $('#reflect-option-info').on('click', function () {
        // numberingIsDefaultRadio();
        resetOption();
    });

    /// DBのトッピングデータをトッピングリストへ追加
    function extractInsertToppingInfo(docData) {
        console.log("（in extractInsertToppingInfo）docData : ", docData);
        docData["choices"].forEach(function (toppingChoicesElement, toppingChoicesIndex) {
            console.log("toppingChoicesElement : ", toppingChoicesElement);
            console.log("toppingChoicesIndex : ", toppingChoicesIndex);

            /// tableへ追加する処理
            let toppingTable = document.getElementById('topping-table');
            let row = toppingTable.insertRow();
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            let cell3 = row.insertCell(2);
            let cell4 = row.insertCell(3);
            let cell5 = row.insertCell(4);
            let cell6 = row.insertCell(5);

            let HTML4 = "";

            console.log("is_sale : ", toppingChoicesElement["is_sale"]);

            /// トッピング名
            let HTML1 = '<td><span class="topping-item topping-general-text">' + toppingChoicesElement["select_description"] + '</span><span class="topping-edit"><i class="fas fa-pen"></i></span></td>';
            /// 通常価格
            let HTML2 = '<td><span class="topping-value topping-general-text">' + toppingChoicesElement["price"] + '</span>円<span class="topping-edit"><i class="fas fa-pen"></i></span></td>';
            /// セール価格増減
            let HTML3 = '<td><span class="topping-sale-price topping-general-text">' + toppingChoicesElement["sale_price"] + '</span>円<span class="topping-edit"><i class="fas fa-pen"></i></span></td>';
            /// セール適用チェックボックス
            if (toppingChoicesElement["is_sale"]) {
                HTML4 = `
            <td>
                <label class="sale-checkbox-label">
                    <input class="topping-sale-checkbox" type="checkbox" name="topping-sale-price-checkbox-name" checked>セール価格を適用
                </label>
            </td>
            `;
            } else {
                HTML4 = `
            <td>
                <label class="sale-checkbox-label">
                    <input class="topping-sale-checkbox" type="checkbox" name="topping-sale-price-checkbox-name">セール価格を適用
                </label>
            </td>
            `;
            }
            /// 原材料
            let HTML5 = '<td><span class="topping-material topping-general-text">' + toppingChoicesElement["materials"] + '</span><span class="topping-edit"><i class="fas fa-pen"></i></span></td>';
            /// 削除ボタン
            let HTML6 = '<input type="button" class="btn btn-danger" value="削除" onclick="deleteRow(this)" />';

            cell1.innerHTML = HTML1;
            cell2.innerHTML = HTML2;
            cell3.innerHTML = HTML3;
            cell4.innerHTML = HTML4;
            cell5.innerHTML = HTML5;
            cell6.innerHTML = HTML6;

            ///トッピングリストが変わったので、トッピングオプションをリセットする
            resetToppingOption();
        });
    }

    function extractOptionSettings(docData) {
        let isSaleCount = 0;
        // let isDefaultCount = 0;

        ///===全体としての材料にご飯があるかどうかについてのチェックボックスへ、DBの値を反映する
        console.log("docData : ", docData);
        console.log("docData[stocks] : ", docData["stocks"]);
        console.log("stocksのstock_selectionにriceを持つデータがあるか？", docData["stocks"].some(hoge => hoge.stock_selection === "rice"));
        console.log("stocksのstock_selectionにdummyを持つデータがあるか？", docData["stocks"].some(hoge => hoge.stock_selection === "dummy"));

        document.getElementById("general-rice-checkbox").checked = docData["stocks"].some(hoge => hoge.stock_selection === "rice");

        ///=== optionSettingsについて、DBの値を反映する
        docData["option_settings"].forEach(function (optionSettingsElement, optionSettingsIndex) {
            console.log("オプション名（大項目） : ", optionSettingsElement["option_description"]);

            if (optionSettingsElement["option_description"] == "トッピング") {
                ///=== トッピングについて
                extractInsertToppingInfo(optionSettingsElement);
            }
            // return;

            /// トッピングの時はこのボックスを増やさないのでスルー
            if (!(optionSettingsElement["option_description"] == "トッピング")) {
                /// 大項目の枠を追加
                let optionAllSettingBox = document.getElementById("option-all-setting-box");
                // optionAllSettingBox.insertAdjacentHTML('beforeend', bigBoxDiv);

                if (optionSettingsIndex == 0) {
                    optionAllSettingBox.insertAdjacentHTML('beforeend', justSettingFrameDivRice);
                } else {
                    optionAllSettingBox.insertAdjacentHTML('beforeend', justSettingFrameDiv);
                }
                console.log("optionSettingsElement : ", optionSettingsElement);
                console.log("optionSettingsIndex : ", optionSettingsIndex);
                console.log("optionSettingsElement : ", optionSettingsElement);
                console.log("optionSettingsElement[choices] : ", optionSettingsElement["choices"]);
                console.log("optionSettingsElement[required] : ", optionSettingsElement["required"]);
                /// 大項目
                console.log("DBG_1 : ", document.querySelectorAll('.option-setting-box'));
                console.log("DBG_2 : ", document.querySelectorAll('.option-setting-box')[optionSettingsIndex]);
                console.log("DBG_3 : ", document.querySelectorAll('.option-setting-box')[optionSettingsIndex].querySelectorAll('.option-text')[0]);
                document.querySelectorAll('.option-setting-box')[optionSettingsIndex].querySelectorAll('.option-text')[0].innerText = optionSettingsElement["option_description"];
                /// 複数選択可能かどうかのチェックボックス
                console.log("複数選択 : ", document.getElementsByName("multiple-checkbox-name"));
                console.log("optionSettingsElement[required] : ", optionSettingsElement["required"]);
                document.getElementsByName("multiple-checkbox-name")[optionSettingsIndex].checked = !optionSettingsElement["required"];
                /// ご飯をを使用するかどうかのチェックボックス
                // document.getElementsByName("rice-checkbox-name")[optionSettingsIndex].checked = optionSettingsElement[""];
                console.log("■DBG_1_choices : ", optionSettingsElement["choices"]);

                optionSettingsElement["choices"].forEach(function (choicesElement, choicesIndex) {
                    console.log("choicesIndex : ", choicesIndex);

                    let numOfSettings = document.querySelectorAll('.option-setting-box').length;
                    let lastOptionSettingBox = document.querySelectorAll('.option-setting-box')[numOfSettings - 1]


                    /// 小項目の追加
                    // $(".add-option-item-div").eq(0).before(option_div_code_size);
                    // $(".add-option-item-div").eq(optionSettingsIndex).before(option_div_code_size);
                    /// もしサイズのボックスを追加なら内容量の変化などありのバージョンのボックスを追加
                    if (optionSettingsIndex == 0) {
                        $(".add-option-item-div").eq(optionSettingsIndex).before(option_div_code_size);
                    }
                    /// それ以外は内容量の変化などなしのバージョンのボックスを追加
                    /// ここでセッティングの中身をDBからの入れる（小オプションについて。セール価格や初期選択も。）
                    else {
                        $(".add-option-item-div").eq(optionSettingsIndex).before(option_div_code_general);
                        /// 名前をdefault-selection-nameからoption-setting数に合わせて更新する（トッピングも入ってしまうためlength - 1）
                        // console.log("docData[`option_settings`] : " , docData["option_settings"]);
                        // console.log("numOfSettings : " , numOfSettings);

                        console.log("last option-setting-box : ", lastOptionSettingBox);
                        console.log("option-radio-button All : ", lastOptionSettingBox.querySelectorAll('.option-radio-button'));
                        console.log("option-radio-button : ", lastOptionSettingBox.querySelectorAll('.option-radio-button')[choicesIndex]);
                        lastOptionSettingBox.querySelectorAll('.option-radio-button')[choicesIndex].setAttribute('name', `default-selection-name-${numOfSettings - 1}`);
                        // lastOptionSettingBox.querySelectorAll('.option-radio-button')[choicesIndex].checked = true;
                    }
                    ///===サイズのボックスのみにある項目を分離
                    if (optionSettingsIndex == 0) {
                        /// ご飯をを使用するかどうかのチェックボックス
                        // optionSettingsElement["choices"][choicesIndex]["stock_selection"]
                        console.log("stock_selection : ", optionSettingsElement["choices"][choicesIndex]["stock_selection"]);
                        if (optionSettingsElement["choices"][choicesIndex]["stock_selection"] == "rice") {
                            console.log("ご飯あり");
                            document.getElementsByName("rice-checkbox-name")[optionSettingsIndex].checked = true;
                        } else {
                            console.log("ご飯なし");
                            document.getElementsByName("rice-checkbox-name")[optionSettingsIndex].checked = false;
                        }
                        /// 量増減
                        document.querySelectorAll('.option-setting-box')[optionSettingsIndex].querySelectorAll('.amount-change')[choicesIndex].value = optionSettingsElement["choices"][choicesIndex]["consumption"];
                    }

                    /// 小項目名
                    document.querySelectorAll('.option-setting-box')[optionSettingsIndex].querySelectorAll('.option-text')[choicesIndex + 1].innerText = optionSettingsElement["choices"][choicesIndex]["select_description"];
                    /// 価格増減
                    // document.querySelectorAll('.option-setting-box')[optionSettingsIndex].querySelectorAll('.amount-price-change')[choicesIndex].value = 10;
                    document.querySelectorAll('.option-setting-box')[optionSettingsIndex].querySelectorAll('.amount-price-change')[choicesIndex].value = optionSettingsElement["choices"][choicesIndex]["price"];

                    /// 原料名
                    document.querySelectorAll('.option-setting-box')[optionSettingsIndex].querySelectorAll('.option-material-textbox')[choicesIndex].value = optionSettingsElement["choices"][choicesIndex]["materials"];
                    /// セール価格増減
                    document.querySelectorAll('.option-setting-box')[optionSettingsIndex].querySelectorAll('.sale-price')[choicesIndex].value = optionSettingsElement["choices"][choicesIndex]["sale_price"];
                    /// セール価格を適用のチェック
                    console.log("optionSettingsElement[choices][choicesIndex][is_sale] : ", optionSettingsElement["choices"][choicesIndex]["is_sale"]);
                    // document.getElementsByName("each-sale-price-checkbox-name")[choicesIndex].checked = optionSettingsElement["choices"][choicesIndex]["is_sale"];
                    document.getElementsByName("each-sale-price-checkbox-name")[isSaleCount].checked = optionSettingsElement["choices"][choicesIndex]["is_sale"];
                    isSaleCount++;

                    /// 初期選択のラジオボタン
                    // document.getElementsByName("default-selection-name")[choicesIndex].checked = optionSettingsElement["choices"][choicesIndex]["is_default"];
                    // document.getElementsByName("default-selection-name")[isDefaultCount].checked = optionSettingsElement["choices"][choicesIndex]["is_default"];
                    // document.getElementsByName("default-selection-name-0")[isDefaultCount].checked = optionSettingsElement["choices"][choicesIndex]["is_default"];
                    console.log("読み込むname : ", `default-selection-name-${optionSettingsIndex}`);
                    // document.getElementsByName(`default-selection-name-${optionSettingsIndex}`)[isDefaultCount].checked = optionSettingsElement["choices"][choicesIndex]["is_default"];

                    console.log("今回のチェック : ", optionSettingsElement["choices"][choicesIndex]["is_default"]);
                    console.log("choicesElement : ", choicesElement);
                    console.log("choicesElement[is_default] : ", choicesElement["is_default"]);
                    // choicesElement["is_default"].checked = optionSettingsElement["choices"][choicesIndex]["is_default"];
                    // choicesElement["is_default"].checked = true;
                    // lastOptionSettingBox.querySelectorAll('.option-radio-button')[choicesIndex].checked = true;
                    lastOptionSettingBox.querySelectorAll('.option-radio-button')[choicesIndex].checked = optionSettingsElement["choices"][choicesIndex]["is_default"];

                    // isDefaultCount++;
                });
            } else {
                console.log("これはトッピングなのでスルー");
            }
        });
    }

    /// （第１バージョン）DBからトッピングやメニューの情報を各パートへ入れていく
    function extractMenuData(user, docData) {
        /// アカウント情報をDBからフォームへ入力
        // let docRef = db.collection(collection_name).doc(user.uid);
        // docRef.get().then(function(doc) {
        //     if (doc.exists) {
        console.log("docData[topping] : ", docData["topping"]);

        // ///オプションをDBから読んで追加
        extractOptionSettings(docData);

        ///=== 各メニューのデータをDBからフォームへ入力
        if (docData["type_order"]) {
            console.log("type_order: ", docData["type_order"]);
            // console.log(docData["type_order"][0]);
            // console.log(docData["type_order"][1]);
            docData["type_order"].forEach(function (type_orderElement, index) {
                // console.log("■■■■■■■■■type_order");
                console.log("index : ", index);
                console.log(type_orderElement);
                console.log(type_orderElement["img_path"]);
                console.log(type_orderElement["title"]);
                /// タブを生成
                extracttype_order(type_orderElement, docData, index);

            });
        } else {
            console.log("type_orderデータなし");
        }
    }

    updateMenuOptionAction();

    // function qrGenerate(data){
    //     const canvas = new OffscreenCanvas(1, 1);

    //     return new Promise((res, rej) => QRCode.toCanvas(canvas, data, {}, err => !err ? res(canvas) : rej(err)));
    // }

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            userGlobal = user;
            /// ドキュメントを取得
            let docRef = db.collection(collection_name).doc(user.uid);
            docRef.get().then(function (doc) {
                if (doc.exists) {
                    ///---生成サイト情報の表示
                    let generatedUrl = "https://app.ghostbento.com/webOrder/index.html?auth_user=" + user.uid
                    /// 生成サイトURLの入れ込み
                    document.getElementById("site-url").innerHTML = `<a href=${generatedUrl} alt="">${generatedUrl}</a>`;
                    // document.getElementById("site-url").innerHTML =`XXX`;
                    /// QRの生成、表示
                    let qrcode = new QRCode(document.getElementById("qrcode"), {
                        text: generatedUrl,
                        width: 128,
                        height: 128,
                        colorDark: "#000000",
                        colorLight: "#ffffff",
                        correctLevel: QRCode.CorrectLevel.H
                    });

                    console.log("uidのドキュメントあり");
                    if (doc.data()["menu_map"]) {
                        console.log("menu_mapのドキュメントあり");
                        /// DBから各メニューデータを取得してフロントのUIに情報を入れていく
                        extractMenuData(user, doc.data());
                        /// menuのボックスを生成したあとにボックスの中にオプションデータを入れる
                        // resetOption();
                    } else {
                        console.log("uidのドキュメントはあるが、menu_mapのドキュメントなし");
                        console.log("menu_mapデータがないので、デフォルトのサイズオプションのUIを配置");
                        document.getElementById('option-all-setting-box').innerHTML = amountSettingDiv;
                    }
                } else {
                    console.log("uidのドキュメントなし");
                }
            }).catch(function (error) {
                console.log("DBG25_Error getting document:", error);
            });

        } else {
            console.log("ユーザーなし");
        }
    });

    ///===

    let menuClass = class {
        constructor(z) {
            this.z = z
        }
        get getZ() {
            return this.z
        }
        set setZ(z) {
            /* set構文 */
            this.z = z
        }
    }

    $(document).ready(function () {
        $("#shapeshift_1").shapeshift();

        $(".trash").shapeshift({
            autoHeight: false,
            colWidth: 80,
            enableTrash: true
        });

        $containers = $(".ss-container")
        // $containers.on("ss-trashed", (e, selected) ->  {
        // console.log "This item:", $(selected)
        // console.log "Has been removed from the DOM"
        // });
        $containers.on("ss-trashed", (e, selected) => {
            console.log("This item:", $(selected));
            console.log("Has been removed from the DOM");
        })

        // $(document).on("click", ".menu-items", function(){
        // });

        // $("#shapeshift_2").shapeshift();
        // $("#shapeshift_3").shapeshift();
        // $("#shapeshift_4").shapeshift();
        // $("#shapeshift_5").shapeshift();
        // $("#shapeshift_6").shapeshift();
    });

    ///
    $(document).on("click", ".add-button", function () {
        console.log("DBG_20");
        // alert(".add-button");
        let tabIndex = $('.add-button').index(this);
        // alert(tabIndex);
        console.log("DBG_21");
        console.log("$('.add-button').index(this) : ", $('.add-button').index(this));

        $(`#shapeshift_${tabIndex + 1}`).append(menu_div_code);
        console.log("DBG_22");
        console.log("DBG_23 : ", tabIndex + 1);

        $(`#shapeshift_${tabIndex + 1}`).shapeshift();

        updateMenuOptionAction();
        // resetToppingOption();
        ///追加されたボックスのトッピングの欄を更新
        orgEachTabBox[tabIndex] = orgEachTabBox[tabIndex] + 1;
        // currentEachTabBox[tabIndex] = currentEachTabBox[tabIndex] + 1;
        // addToppingOption(tabIndex);

        /// トッピング情報を追加
        addToppingOption();
        /// 汎用オプション情報を追加
        addgeneralOption();

        // alert(currentEachTabBox);
        // alert(currentEachTabBox[0]);
        // alert(currentEachTabBox[1]);
        // alert("DBG_add_" + $("#menu-tabs ul").sortable('toArray'));

    });


    /// ボックスのクリック
    $(document).on("click", ".menu-items", function () {
        let index = $('.menu-items').index(this);
    });

    $(document).on("click", ".my-trash", function () {
        /// shapeshift_xを取得
        const parent = this.parentNode.parentNode;
        const parentIdSelector = `#${parent.id}`;
        // console.log("parent", parent);
        console.log("parent.id", parent.id);
        // alert(`parent : ${parent}`);
        // alert(`parent.id : ${parent.id}`);
        let result = parent.id.split('_');
        // alert(`result : ${result}`);
        ///現在のタブ番号
        let tabNumber = result[1];
        // alert(`tabNumber : ${tabNumber}`);

        // alert(`parentIdSelector : ${parentIdSelector}`);

        // console.log(`#${parent.id}`);
        console.log(parentIdSelector);
        // alert(index);

        // alert("本当に削除しますか？");
        if (window.confirm("本当に削除しますか？")) {
            // OKが選択された時の処理
            $(this).parent().remove(); //divとその中身が全て消える
            // $("#shapeshift_1").shapeshift();
            // $("#shapeshift_2").shapeshift();
            // $("#shapeshift_3").shapeshift();
            // $("#shapeshift_4").shapeshift();
            // $("#shapeshift_5").shapeshift();
            $(parentIdSelector).shapeshift();

            ///ボックス数を変更
            orgEachTabBox[tabNumber - 1] = orgEachTabBox[tabNumber - 1] - 1;
            // currentEachTabBox[tabNumber - 1] = currentEachTabBox[tabNumber - 1] - 1;
        }
    });

    // 一つの種類のタブに関して、数を取得
    function check_div_num() {
        console.log("===check_div_num");

        let menu_div_selectors = document.querySelectorAll('.menu-divs')
        console.log("menu_div_selectors : ", menu_div_selectors);
        console.log("menu_div_selectors.length : ", menu_div_selectors.length);

        console.log("===check_div_num Fin");

        return menu_div_selectors.length;
    }

    function getSortedEachBox() {
        let currentOrderArray = $("#menu-tabs ul").sortable('toArray');

        ///コピー
        let currentEachTabBox = orgEachTabBox.slice();
        // console.log("DBG8_currentEachTabBox : ", currentEachTabBox);

        for (i = 0; i < currentOrderArray.length; ++i) {
            // let currentOrderArray = currentOrderArray;
            currentEachTabBox[i] = orgEachTabBox[(currentOrderArray[i] - 1).toString()];
            // alert("DBG_in_sorted_currentEachTabBox : ", currentEachTabBox)
        }
        // console.log("DBG7_in_sorted_currentEachTabBox : ", currentEachTabBox);

        return currentEachTabBox;
    }

    function checkAmountValueInput(size, valueType, targetValue) {
        let errMsg = "";
        ///入力が空だった場合と、文字数制限を超えた場合にアラートを出す。
        if (targetValue == "") {
            // alert(`${size}の金額に空欄があります`);
            errMsg = `${size}の${valueType}に空欄があります`;
            return [false, errMsg];
        }
        ///金額が数値出ない文字を含んでいたらreturn
        if (isNaN(targetValue)) {
            // alert(`${size}の金額には半角の数値のみを入力してください`);
            errMsg = `${size}の${valueType}には半角の数値のみを入力してください`;
            return [false, errMsg];
        }
        ///金額にスペース（半角スペースまたは全角スペース）が入っていたらreturn
        if (targetValue.match(/ /) || targetValue.match(/　/)) {
            // alert(`${size}の金額にスペースが入っています`);
            errMsg = `${size}の${valueType}にスペースが入っています`;
            return [false, errMsg];
        }

        return [true, "正常です"]
    }

    ///0〜(rondoMaxValue-1)までの乱数を生成
    function getRondomSuffix(rondoMaxValue) {
        let random = Math.floor(Math.random() * rondoMaxValue);
        console.log(random);
        return random;
    }

    ///配列の中に重複がなければfalseあればtrueを返す。
    function checkDuplicate(targetArray) {
        let duplicateFlag = false;
        // const array1 = [1, 2, 3, 3, 5, 7];
        // let array1 = [1, 2, 3, 6, 5, 7];
        let array1 = targetArray;
        let array2 = Array.from(new Set(array1))
        console.log(array1);
        console.log(array2); // [ 1, 5, 3 ]
        console.log(array1.length);
        console.log(array2.length); // [ 1, 5, 3 ]

        if (array1.length != array2.length) {
            duplicateFlag = true;
        }
        console.log("duplicateFlag : ", duplicateFlag);

        return duplicateFlag;
    }


    // function updateMenus(menu_map, defaultStock, opening, type_order, option_settings, topping, discountRate, isDiscount, restaurantCollection) {
    function updateMenus(menu_map, type_order, option_settings, restaurantCollection, stocksArray, topAdSlider) {
        // return restaurantCollection.update({
        return restaurantCollection.set({
            ///キーへの変数展開は[変数]
            // menu_map,
            menu_map,
            // ingredients : {
            //     rice: {
            //         stock: defaultStock,
            //     },
            // },
            // opening : opening,
            type_order,
            option_settings,
            // topping,
            // discountRate : discountRate,
            // isDiscount : isDiscount,
            stocks: stocksArray,
            top_ad_slider: topAdSlider
        }, { merge: true })
            .then(function () {
                console.log("Document successfully updated!");
                alert('登録情報を更新しました');
                /// ローディング画面を非表示
                setLoadingStatus('none');

                // console.log('登録情報を更新しました');
                // console.log("1div-menu登録直後のimageSavedCount : ", imageSavedCount);
                //ここを一時的にコメントアウト
                // document.location.href = page_url;
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                alert('メニューの登録に失敗しました。');

                /// ローディング画面を非表示
                setLoadingStatus('none');

                // alert('アカウント情報がありません。先にアカウント登録を行ってください');
                console.error("Error updating document: ", error);
            });
    }


    /// 画像の登録の非同期処理によって順番が前後してしまうことがあるので、ボックスのメニューの名前順にソートしなおす
    // function sortMenuMap() {
    function sortMenuMap(menu_map) {
        // メニュー名がキーになっているD構造のときの実装
        if (false) {
            let referenceSortItemNameArray = [];

            console.log("menu-divs", document.querySelectorAll('.menu-divs'));
            let meuDivs = document.querySelectorAll('.menu-divs');
            meuDivs.forEach((p, menuDivIndex) => {
                console.log("menuDivIndex : ", menuDivIndex);
                console.log("meuDivs['menuDivIndex'] : ", meuDivs[menuDivIndex]);
                console.log("item-name : ", meuDivs[menuDivIndex].querySelector(".item-name").textContent);
                let itemName = meuDivs[menuDivIndex].querySelector(".item-name").textContent;
                referenceSortItemNameArray.push(itemName);
            });

            // /// フォームのボックスの商品の順番
            // Object.keys(menu_map).forEach(function (data) {
            //     // console.log("data : ", data);
            //     // if (Object.keys(menu_map[data] == "からあげ")) {
            //     //     console.log("からあげです");
            //     // }
            // })

            // let counter = 0;
            /// ソート前の配列
            let beforeSortedArray = [];
            /// ソート後の配列
            let sortedMenuMap = [];

            console.log("menu_map : ", menu_map);
            console.log("------");
            menu_map.forEach((p, index) => {
                console.log("---referenceSortItemNameArray[index] : ", referenceSortItemNameArray[index]);
                console.log("menu_map.indexOf(referenceSortItemNameArray[index]) : ", menu_map.indexOf(referenceSortItemNameArray[index]));
                console.log("index : ", index);
                console.log("menu_map[index] : ", menu_map[index]);
                console.log("Object.keys(menu_map[index])[0] : ", Object.keys(menu_map[index])[0]);
                // console.log("Object.keys(menu_map[index]['0']) : " , Object.keys(menu_map[index]['0']));
                // console.log("Object.keys(menu_map[index][0]) : " , Object.keys(menu_map[index][0]));
                // if (Object.keys(menu_map[index])[0] == "からあげ") {
                //     console.log("DBG_2_からあげです");
                // }
                console.log("Object.keys(menu_map[index]) : ", Object.keys(menu_map[index]));
                beforeSortedArray.push(Object.keys(menu_map[index])[0]);
            });
            console.log("------");


            console.log("referenceSortItemNameArray : ", referenceSortItemNameArray);
            console.log("beforeSortedArray : ", beforeSortedArray);

            referenceSortItemNameArray.forEach((p, referenceIndex) => {
                console.log("referenceSortItemNameArray[referenceIndex] : ", referenceSortItemNameArray[referenceIndex]);
                let targetItemName = referenceSortItemNameArray[referenceIndex]
                console.log("beforeSortedArray.indexOf(targetItemName) : ", beforeSortedArray.indexOf(targetItemName));
                /// ソート前の配列の中で今回対象のインデックスが何番目にあるか
                let targetIndex = beforeSortedArray.indexOf(targetItemName);
                sortedMenuMap.push(menu_map[targetIndex]);
            });

            console.log("sortedMenuMap : ", sortedMenuMap);

            // /// こちらの処理は破壊的
            // menu_map.sort(function(x, y) {
            //     return referenceSortItemNameArray.indexOf(x.jyunin) - referenceSortItemNameArray.indexOf(y.jyunin);
            // })

            // sortedMenuMap = menu_map.slice();

            console.log("menu_map : ", menu_map);
            console.log("sortedMenuMap : ", sortedMenuMap);

            return sortedMenuMap;
        }
        console.log("---");
        console.log("menu_map : ", menu_map)
        let referenceSortItemNameArray = [];

        console.log("menu-divs", document.querySelectorAll('.menu-divs'));
        let meuDivs = document.querySelectorAll('.menu-divs');
        meuDivs.forEach((p, menuDivIndex) => {
            console.log("menuDivIndex : ", menuDivIndex);
            console.log("meuDivs['menuDivIndex'] : ", meuDivs[menuDivIndex]);
            console.log("item-name : ", meuDivs[menuDivIndex].querySelector(".item-name").textContent);
            let itemName = meuDivs[menuDivIndex].querySelector(".item-name").textContent;
            referenceSortItemNameArray.push(itemName);
        });
        /// ソート前の配列
        let beforeSortedArray = [];
        /// ソート後の配列
        let sortedMenuMap = [];
        menu_map.forEach((p, index) => {
            console.log("---referenceSortItemNameArray[index] : ", referenceSortItemNameArray[index]);
            console.log("menu_map.indexOf(referenceSortItemNameArray[index]) : ", menu_map.indexOf(referenceSortItemNameArray[index]));
            console.log("index : ", index);
            console.log("menu_map[index] : ", menu_map[index]);
            console.log("Object.keys(menu_map[index])[0] : ", Object.keys(menu_map[index])[0]);
            console.log("Object.keys(menu_map[index]) : ", Object.keys(menu_map[index]));
            // beforeSortedArray.push(Object.keys(menu_map[index])[0]);
            beforeSortedArray.push(menu_map[index]['menu_name']);
        });
        console.log("beforeSortedArray : " , beforeSortedArray);
        referenceSortItemNameArray.forEach((p, referenceIndex) => {
            console.log("referenceSortItemNameArray[referenceIndex] : ", referenceSortItemNameArray[referenceIndex]);
            let targetItemName = referenceSortItemNameArray[referenceIndex]
            console.log("beforeSortedArray.indexOf(targetItemName) : ", beforeSortedArray.indexOf(targetItemName));
            /// ソート前の配列の中で今回対象のインデックスが何番目にあるか
            let targetIndex = beforeSortedArray.indexOf(targetItemName);
            sortedMenuMap.push(menu_map[targetIndex]);
        });
        console.log("sortedMenuMap : " , sortedMenuMap);
        console.log("---");
        
        return sortedMenuMap;
    }

    function resizeAndToBlob(width, inputImg) {
        //縦横比を維持した縮小サイズを取得
        // let w = 200;
        // let width = 300;
        // let width = 1000;
        let ratio = width / inputImg.width;
        let height = inputImg.height * ratio;

        //canvasに描画
        // let canvas = currentShapeshiftElement.children[j].querySelector('.canvas-for-resize');
        // let canvas = $("#canvas");
        // let canvas = $("#canvas-for-resize");
        let canvas = $("#for-resize-canvas");
        console.log("canvas : ", canvas);
        $("#for-resize-canvas").attr("width", width);
        $("#for-resize-canvas").attr("height", height);
        // let canvas = canvasObj;
        let ctx = canvas[0].getContext('2d');

        ctx.drawImage(inputImg, 0, 0, width, height);

        // canvasから画像をbase64として取得する
        let base64 = canvas.get(0).toDataURL('image/jpeg');
        console.log("base64 : ", base64);

        // base64から画像データを作成する
        let barr, bin, blobCount, len;
        /// ORG
        bin = atob(base64.split('base64,')[1]);

        console.log("bin : ", bin);

        len = bin.length;
        barr = new Uint8Array(len);
        blobCount = 0;
        while (blobCount < len) {
            barr[blobCount] = bin.charCodeAt(blobCount);
            blobCount++;
        }
        blob = new Blob([barr], { type: 'image/jpeg' });
        console.log("blob : ", blob);

        return blob;
    }

    /// 配列内で値が重複してないか調べる
    function existsSameValue(a) {
        var s = new Set(a);
        return s.size != a.length;
    }
    /// 
    function existsExistRestaurant(restaurantCollection) {
        return new Promise((resolve, reject) => {

            let registerCheckObj = {
                isAccountRegister: false,
                isMenuMapRegister: false,
                isStockRegister: false,
                stockDoc: []
            }

            let docRef = restaurantCollection;
            docRef.get().then(function (doc) {
                if (doc.exists) {
                    console.log("doc.id : ", doc.id);
                    console.log("doc.data() : ", doc.data());
                    console.log("doc.data()['stocks'] : ", doc.data()['stocks']);
                    if (doc.data()['account'] != undefined) {
                        registerCheckObj.isAccountRegister = true;
                    }
                    if (doc.data()['menu_map'] != undefined) {
                        registerCheckObj.isMenuMapRegister = true;
                    }
                    if (doc.data()['stocks'] != undefined) {
                        registerCheckObj.isStockRegister = true;
                        registerCheckObj.stockDoc = doc.data()['stocks'];
                    }
                    resolve(registerCheckObj);
                    registerCheckObj
                    // restaurantName = doc.data()["account"]["restaurantName"];
                    // console.log("DBG_102_restaurantName : ", restaurantName);
                } else {
                    resolve(registerCheckObj);
                    // console.log("DBG16_No such document!");
                }
            }).catch(function (error) {
                resolve(registerCheckObj);
                console.log("Error getting document:", error);
            });
        });
    }

    /// オブジェクトの配列の中に検索項目があるかどうかを検索、あればオブジェクト、なければundefinedが帰ってくる
    function searchObj(targetArray, words) {
        return targetArray.find((array) => array.stock_selection === words);
    }



    // メニュー登録ボタン押下後
    // $('#send-menu-info-button').on('click', async function () {
    $("#send-menu-info-button").click(async () => {
        // $("#send-menu-info-button").click=async ()=> {

        // document.getElementById("send-menu-info-button").onclick = async () => {
        console.log("■■■■■■#send-menu-info-button Clicked! Start");
        /// ローディングを表示
        setLoadingStatus('');

        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                console.log("user : ", user);
                let restaurantCollection = db.collection(collection_name).doc(user.uid);

                ///===定数（決め打ちの値）
                ///商品在庫
                let defaultStock = 0;
                /// サイズのボックス以外の消費量
                const constConsumption = 0;
                /// オプションについてのArray
                let option_settings = [];

                /// stocksについてのArray
                let stocksArray = [];

                let isSaleCount = 0;
                let isDefaultCount = 0;

                /// 内容量の変化
                let amountChange = 0;

                /// トップ宣伝画像情報
                let topAdSlider = [
                    {
                        image: 'https://firebasestorage.googleapis.com/v0/b/gadandan-356bb.appspot.com/o/Restaurants%2FBbT9qO5EqwScTrwmnHL7ghVTnG02%2FmenuImages%2F%E8%82%89%E5%B7%BB%E3%81%8D%E5%8D%97%E7%93%9C%E3%81%A8%E3%83%8A%E3%83%83%E3%83%84%E3%81%AE%E3%82%B9%E3%83%91%E3%82%A4%E3%82%B9%E3%82%AB%E3%83%AC%E3%83%BC786566718?alt=media&token=6487b898-f755-433f-957f-78a74d6229af',
                        main_title_string: 'title_of_top_main_string',
                        sub_title_string: 'title_of_sub_top_string',
                    },
                    {
                        image: 'https://firebasestorage.googleapis.com/v0/b/gadandan-356bb.appspot.com/o/Restaurants%2FBbT9qO5EqwScTrwmnHL7ghVTnG02%2FmenuImages%2F%E3%82%B8%E3%83%A3%E3%83%B3%E3%81%95%E3%82%93%E3%81%AE%E3%82%B0%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%AB%E3%83%AC%E3%83%BC709025558972?alt=media&token=09661f87-68db-4763-8eda-c1d0ea9b1d7d',
                        main_title_string: 'title_of_top_main_string',
                        sub_title_string: 'title_of_sub_top_string',
                    },
                    {
                        image: 'https://firebasestorage.googleapis.com/v0/b/gadandan-356bb.appspot.com/o/Restaurants%2FBbT9qO5EqwScTrwmnHL7ghVTnG02%2FmenuImages%2F%E3%82%B8%E3%83%A3%E3%83%B3%E3%81%95%E3%82%93%E3%81%AE%E3%83%91%E3%83%8D%E3%83%BC%E3%83%B3%E3%82%AB%E3%83%AC%E3%83%BC818411686953?alt=media&token=a2a063b1-fd2e-48a0-bfd9-b1f3d8707b06',
                        main_title_string: 'title_of_top_main_string',
                        sub_title_string: 'title_of_sub_top_string',
                    },
                ]

                /// 既存店舗の情報があるかどうかチェック
                const registerCheckObj = await existsExistRestaurant(restaurantCollection, user)
                console.log("registerCheckObj : ", registerCheckObj);
                if (!registerCheckObj.isAccountRegister) {
                    console.log("registerCheckObj is undefined");
                    alert('先にアカウント登録が必要です')
                    /// ローディング画面を非表示
                    setLoadingStatus('none');
                    return;
                }

                // return;

                ///===（全体として）ご飯が材料にあるかどうかのチェックボックス情報
                let isGeneralRiceCheck = document.getElementById("general-rice-checkbox").checked;
                console.log("isGeneralRiceCheck : ", isGeneralRiceCheck);

                /// オブジェクトの配列の中に検索項目があるかどうかを検索、あればオブジェクト、なければundefinedが帰ってくる
                let searchResult = searchObj(registerCheckObj.stockDoc, 'rice')
                // const item = 'rice';
                // let searchResult = registerCheckObj.stockDoc.find((array) => array.stock_selection === item);
                console.log('searchResult: ', searchResult);

                /// 既に在庫があれば数値はそのまま、なければdefaultStock
                let riceStock = 0;
                if (searchResult) {
                    riceStock = searchResult['stock'];
                }
                else {
                    riceStock = defaultStock;
                }
                /// ご飯を在庫管理リストへ追加
                if (isGeneralRiceCheck) {
                    stocksArray.push({
                        stock: riceStock,
                        stock_selection: "rice",
                    });
                }
                console.log("stocksArray : ", stocksArray);

                // return;

                ///---入力判定
                /// 同じ項目のオプションがあったらreturn
                // let allBigOptions = document.querySelectorAll('.option-setting-box').querySelector('.option-wrapper')
                // console.log("allBigOptions : " , allBigOptions);

                // return;

                ///===トッピング情報
                let topping = {};
                let richTopping = {};
                let toppingChoices = [];

                document.querySelectorAll('.topping-item').forEach((p, index) => {
                    /// トッピング名
                    let toppingItem = document.querySelectorAll('.topping-item')[index].innerText;
                    console.log("toppingItem : ", toppingItem);
                    /// 通常価格
                    let toppingValue = Number(document.querySelectorAll('.topping-value')[index].innerText);
                    console.log("toppingValue : ", toppingValue);
                    /// セール価格増減
                    let toppingSaleValue = Number(document.querySelectorAll('.topping-sale-price')[index].innerText);
                    console.log("toppingSaleValue : ", toppingSaleValue);
                    /// セール適用チェックボックス
                    let isToppingSaleCheck = document.getElementsByName("topping-sale-price-checkbox-name")[index].checked;
                    console.log("isToppingSaleCheck : ", isToppingSaleCheck);
                    /// 原材料
                    let toppingMaterial = document.querySelectorAll('.topping-material')[index].innerText;
                    console.log("toppingMaterial : ", toppingMaterial);

                    // choices部分を単体で作成
                    eachChoicesObj = {
                        consumption: 1,
                        is_default: false,
                        is_sale: isToppingSaleCheck,
                        materials: toppingMaterial,
                        price: Number(toppingValue),
                        sale_price: Number(toppingSaleValue),
                        select_description: toppingItem,
                        stock_selection: toppingItem,
                    }
                    toppingChoices.push(eachChoicesObj);

                    /// オブジェクトの配列の中に検索項目があるかどうかを検索、あればオブジェクト、なければundefinedが帰ってくる
                    let searchResult = searchObj(registerCheckObj.stockDoc, toppingItem)
                    console.log('searchResult: ', searchResult);

                    /// 既に在庫があれば数値はそのまま、なければdefaultStock
                    let eachItemStock = 0;
                    if (searchResult) {
                        eachItemStock = searchResult['stock'];
                    }
                    else {
                        eachItemStock = defaultStock;
                    }

                    /// トッピングの項目を在庫管理リストへ登録
                    stocksArray.push({
                        stock: eachItemStock,
                        stock_selection: toppingItem,
                    });
                });

                console.log("topping : ", topping);
                console.log("toppingChoices : ", toppingChoices);

                richTopping = {
                    choices: toppingChoices,
                    option_description: "トッピング",
                    required: false
                };
                /// このrichToppingをOptionsettingに追加する
                console.log("richTopping : ", richTopping);

                let allOptionDescriptionArr = [];

                // document.querySelectorAll('.option-setting-box').forEach((index) => {
                document.querySelectorAll('.option-setting-box').forEach((p, optionSettingBoxIndex) => {
                    console.log(`============大項目Index : ${optionSettingBoxIndex} Start`);
                    /// 各小項目のオプションが入る配列
                    let choices = [];
                    /// 大項目の説明（例：ご飯サイズ）
                    let option_description = "";
                    /// 複数選択可能（セレクトボックスtrue）か？ラジオボタン（false）か？
                    let required = false;
                    let isRiceCheck = false;
                    let stockSelectionTxt = "";

                    console.log("optionSettingBoxIndex : ", optionSettingBoxIndex);
                    console.log(document.querySelectorAll('.option-setting-box'));
                    console.log(document.querySelectorAll('.option-setting-box')[optionSettingBoxIndex]);
                    // console.log("大項目名 ： ", document.querySelectorAll('.option-text')[optionSettingBoxIndex].innerText);
                    // console.log("大項目名 ： ", document.querySelectorAll('.option-text')[optionSettingBoxIndex].innerText);
                    /// 
                    // console.log("大項目・小項目Array ： ", document.querySelectorAll('.option-setting-box')[optionSettingBoxIndex].querySelectorAll('.option-text'));
                    /// 大項目・小項目を含めたアレイ
                    let allOptionsArray = document.querySelectorAll('.option-setting-box')[optionSettingBoxIndex].querySelectorAll('.option-text');
                    // let allOptionsArray = document.querySelectorAll('.option-setting-box')[optionSettingBoxIndex];
                    console.log("DBG1_allOptionsArray : ", allOptionsArray);

                    // console.log("DBG2_document.querySelectorAll('.option-setting-box')[optionSettingBoxIndex] : " , document.querySelectorAll('.option-setting-box')[optionSettingBoxIndex]);
                    allOptionsArray.forEach((p, allOptionsIndex) => {
                        console.log(`-----------小項目Index : ${allOptionsIndex} Start`);
                        console.log("allOptionsIndex : ", allOptionsIndex);
                        console.log("allOptionsArray[allOptionsIndex] : ", allOptionsArray[allOptionsIndex]);
                        let eachChoicesObj = {};

                        /// 大項目に関するパート
                        if (allOptionsIndex == 0) {
                            console.log("■＝＝＝オプション名 : ", allOptionsArray[allOptionsIndex].innerText);
                            option_description = allOptionsArray[allOptionsIndex].innerText
                            console.log("option_description : ", option_description);
                            console.log("（大項目）smallOptionsArray[allOptionsIndex].innerText : ", allOptionsArray[allOptionsIndex].innerText);
                            // console.log("（大項目）document.querySelectorAll('.option-setting-box')[allOptionsIndex].querySelectorAll('.multiple-checkbox').checked : " , document.querySelectorAll('.option-setting-box')[allOptionsIndex].querySelectorAll('.multiple-checkbox').checked);
                            option_description = allOptionsArray[allOptionsIndex].innerText;
                            allOptionDescriptionArr.push(option_description);

                            /// 複数選択可能かどうかのチェックボックス
                            const multipleCheck = document.getElementsByName("multiple-checkbox-name");
                            console.log("multipleCheck.length : ", multipleCheck.length);
                            /// 現状は一つずつ(.length=1)のはず
                            for (let i = 0; i < multipleCheck.length; i++) {
                                console.log("multipleCheck[i].checked : ", multipleCheck[i].checked);
                                required = !multipleCheck[i].checked;
                            }
                            /// ご飯の消費量も変わるかどうかのチェックボックス
                            const riceCheck = document.getElementsByName("rice-checkbox-name");
                            console.log("riceCheck.length : ", riceCheck.length);

                            ///===サイズのボックスのみにある項目を分離
                            if (optionSettingBoxIndex == 0) {
                                /// 現状は一つずつ(.length=1)のはず
                                for (let i = 0; i < riceCheck.length; i++) {
                                    isRiceCheck = riceCheck[i].checked;
                                    if (isRiceCheck) {
                                        stockSelectionTxt = "rice";
                                    }
                                    // else {
                                    //     alert('"stockSelectionTxt = ""')
                                    // }
                                }
                            }
                        }
                        /// 小項目に関するパート
                        else {
                            /// 項目名
                            console.log("（小項目）smallOptionsArray[allOptionsIndex] : ", allOptionsArray[allOptionsIndex]);
                            // console.log("（小項目）smallOptionsArray[allOptionsIndex].innerText : " , allOptionsArray[allOptionsIndex].innerText);
                            let select_description = allOptionsArray[allOptionsIndex].innerText;
                            console.log("select_description : ", select_description);
                            // amount-type-class
                            // document.querySelectorAll('.option-setting-box')[optionSettingBoxIndex].querySelectorAll('.amount-type-class');
                            // console.log("DBG3 : " , document.querySelectorAll('.option-setting-box')[optionSettingBoxIndex].querySelectorAll('.amount-price-change'));
                            // console.log("DBG3 : " , document.querySelectorAll('.option-setting-box')[optionSettingBoxIndex].querySelectorAll('.amount-price-change')[allOptionsIndex - 1]);
                            // console.log("DBG3 : " , document.querySelectorAll('.option-setting-box')[optionSettingBoxIndex].querySelectorAll('.amount-price-change')[allOptionsIndex - 1].innerText);

                            /// そのオプションの価格変動
                            // console.log("DBG3 : " , document.querySelectorAll('.option-setting-box')[optionSettingBoxIndex].querySelectorAll('.amount-price-change')[allOptionsIndex - 1].value);
                            let amountPriceChange = document.querySelectorAll('.option-setting-box')[optionSettingBoxIndex].querySelectorAll('.amount-price-change')[allOptionsIndex - 1].value;
                            console.log("量による価格の増減（amountPriceChange） : ", amountPriceChange);

                            console.log("optionSettingBoxIndex : ", optionSettingBoxIndex);
                            console.log("allOptionsIndex : ", allOptionsIndex);
                            ///===サイズのボックスのみにある項目を分離
                            if (optionSettingBoxIndex == 0) {
                                // console.log("DBG1 : " , document.querySelectorAll('.option-setting-box')[optionSettingBoxIndex].querySelectorAll('.amount-change')[allOptionsIndex - 1]);
                                // console.log("DBG2 : " , document.querySelectorAll('.option-setting-box')[optionSettingBoxIndex].querySelectorAll('.amount-change'));
                                /// そのオプションの量の変化（人前）
                                amountChange = document.querySelectorAll('.option-setting-box')[optionSettingBoxIndex].querySelectorAll('.amount-change')[allOptionsIndex - 1].value;
                                console.log("量の増減（amountChange） : ", amountChange);
                            } else {
                                amountChange = constConsumption;
                            }

                            /// そのオプションの原料名
                            // console.log("DBG_1:", document.querySelectorAll('.option-setting-box')[optionSettingBoxIndex].querySelectorAll('.option-material-textbox')[allOptionsIndex - 1]);
                            let optionMaterial = document.querySelectorAll('.option-setting-box')[optionSettingBoxIndex].querySelectorAll('.option-material-textbox')[allOptionsIndex - 1].value;
                            console.log("原料名 : ", optionMaterial);

                            /// セール価格変動値
                            let salePrice = document.querySelectorAll('.option-setting-box')[optionSettingBoxIndex].querySelectorAll('.sale-price')[allOptionsIndex - 1].value;
                            console.log("セール価格変動値（salePrice） : ", salePrice);

                            /// セール価格を適用するかどうかのチェックボックスの値
                            let salePriceElement = document.getElementsByName('each-sale-price-checkbox-name');
                            // let isSalesPrice = salePriceElement.item(allOptionsIndex - 1).checked;
                            let isSalesPrice = salePriceElement.item(isSaleCount).checked;
                            console.log("isSalesPrice : ", isSalesPrice);
                            console.log("isSaleCount : ", isSaleCount);
                            isSaleCount++;

                            /// 初期選択にするかどうかのラジオボタン
                            // default-selection-name
                            // let defoultSelectionElement = document.getElementsByName("default-selection-name");
                            // let isDefaultSelection = defoultSelectionElement[allOptionsIndex - 1].checked
                            // let isDefaultSelection = defoultSelectionElement[isDefaultCount].checked
                            let isDefaultSelection = document.querySelectorAll('.option-setting-box')[optionSettingBoxIndex].querySelectorAll('.option-radio-button')[allOptionsIndex - 1].checked;

                            console.log("isDefaultSelection : ", isDefaultSelection);
                            console.log("isDefaultCount : ", isDefaultCount);
                            isDefaultCount++;

                            eachChoicesObj = {
                                consumption: Number(amountChange),
                                is_default: isDefaultSelection,
                                is_sale: isSalesPrice,
                                materials: optionMaterial,
                                price: Number(amountPriceChange),
                                sale_price: Number(salePrice),
                                select_description: select_description,
                                stock_selection: stockSelectionTxt,
                            }

                            console.log("eachChoicesObj : ", eachChoicesObj);

                            // let checkValue = '';

                            // /// セール価格のチェックボックスの数を利用して他の項目をまとめて取得する
                            // for (let i = 0; i < salePriceElement.length; i++){
                            //     console.log("i : " , i);
                            //     console.log("salePriceElement.item(i).checked : " , salePriceElement.item(i).checked);
                            //     // if (salePriceElement.item(i).checked){
                            //     //     checkValue = salePriceElement.item(i).value;
                            //     // }
                            // }

                            // console.log("allOptionsArray[allOptionsIndex].getElementsByName('each-sale-price-checkbox-name') : " , allOptionsArray[allOptionsIndex].getElementsByName('each-sale-price-checkbox-name'));

                            choices.push(eachChoicesObj);
                            console.log("choices : ", choices);
                        }

                        console.log(`-----------小項目Index : ${allOptionsIndex} Fin`);
                    });

                    /// サイズのオプションを追加
                    option_settings.push({
                        choices: choices,
                        option_description: option_description,
                        required: required
                    });

                    let optionSettingsTotal = document.querySelectorAll('.option-setting-box').length;
                    console.log("optionSettingsTotal : ", optionSettingsTotal);

                    /// 最後の要素、サイズのあとでトッピングを追加
                    if (Object.keys(option_settings).length == optionSettingsTotal) {
                        option_settings.push(richTopping);
                        console.log("option_settings : ", option_settings);
                    }

                    console.log(`============大項目Index : ${optionSettingBoxIndex} Fin`);
                    console.log("");
                });

                console.log("allOptionDescriptionArr : ", allOptionDescriptionArr);
                console.log("重複 : ", existsSameValue(allOptionDescriptionArr));

                /// もし重複しているオプション名（サイズなどの大項目）があればreturn
                if (existsSameValue(allOptionDescriptionArr)) {
                    alert("重複しているオプション名があるので、修正してください");
                    /// ローディング画面を非表示
                    setLoadingStatus('none');

                    return;
                }

                // ///入れ替えられた最新のタブの番号に合わせた、最新のcurrentEachTabBox（各タブの中のメニュー数）を取得する。
                currentEachTabBox = getSortedEachBox();

                ///処理されるタブの順番のアレイ（例：[3,1,2,5,4]）
                ///これをそのままshapeshift_3〜などとして順番に使用していけば、一番左のタブから処理していくことになる。
                let orderTabsProcessedArray = $("#menu-tabs ul").sortable('toArray')

                ///===type_order配列の準備
                let type_order = [];
                // console.log("orderTabsProcessedArray : " , orderTabsProcessedArray);
                // console.log("orderTabsProcessedArray.length : " , orderTabsProcessedArray.length);
                for (let tmp = 0; tmp < orderTabsProcessedArray.length; tmp++) {
                    let type_orderContentObj = {
                        img_path: "dummy.jpg",
                        title: document.querySelectorAll('.change-target')[tmp].innerText,
                    }
                    type_order.push(type_orderContentObj);
                }
                // console.log("type_order : " , type_order);

                ///メニューの写真を保存した回数
                let imageSavedCount = 0;
                ///登録する全てのメニューをこの配列に格納
                let menu_map = [];
                ///商品名に重複があると登録がおかしくなるので、重複をチェックするための配列
                let itemNameDuplicatedCheckArray = []
                ///メニュー数の合計
                let menuNumTotal = document.querySelectorAll('.menu-divs').length;
                console.log("menuNumTotal : ", menuNumTotal);

                ///処理中のタブ名
                // let currentTabName = "";
                for (let i = 0; i < orderTabsProcessedArray.length; i++) {
                    console.log("i : ", i);
                    // console.log("i_1st : " , i);
                    ///===shapeshift_1〜
                    console.log(`===shapeshift_${orderTabsProcessedArray[i]}〜`);

                    console.log(orderTabsProcessedArray[i]);
                    let currentShapeshiftId = "shapeshift_" + orderTabsProcessedArray[i];
                    let currentShapeshiftElement = document.getElementById(currentShapeshiftId);

                    // let childNodesCount = currentShapeshiftElement.childElementCount;
                    // console.log("childNodesCount : ", childNodesCount);
                    // console.log("currentShapeshiftElement : ", currentShapeshiftElement);
                    // console.log("currentShapeshiftElement.children : ", currentShapeshiftElement.children);
                    // console.log("currentShapeshiftElement.children[0] : ", currentShapeshiftElement.children[0]);
                    // console.log("currentShapeshiftElement.children[0] : ", currentShapeshiftElement.children[1]);


                    for (let j = 0; j < currentShapeshiftElement.children.length; j++) {
                        ///===各メニューの登録
                        ///=== menu-divsの1個目〜
                        console.log(`menu-divsの${j + 1}個目〜`);
                        // currentTabName = document.querySelectorAll('.change-target')[i].innerText;

                        ///金額のテキスト
                        let priceText = "";
                        ///商品名のテキスト
                        let itemName = "";
                        ///商品説明のテキスト
                        let itemDescription = "";
                        ///原材料のテキスト
                        let ingredientListText = "";
                        ///各メニューのトッピングの配列
                        // let toppingArray = [];
                        ///DB登録用の各アレルゲン結合用のテキスト
                        // let allergenText = "";
                        /// セール価格
                        let salePrice = 0;
                        /// セール適用チェック
                        let salePriceCheck = false;
                        ///内容量のテキスト
                        let contentsGramText = "";
                        ///内容量の辛さ選択
                        // let isSpiciness = false;
                        ///各メニューのトッピングの配列
                        // let optionArray = [];
                        ///保存方法の番号のテキスト
                        let preservationNumText = "";
                        let preservationText = "";

                        /// サイズやトからさ、トッピングなどの各オプションを入れる配列
                        let options = [];

                        ///===金額
                        console.log(`***金額`);
                        console.log(currentShapeshiftElement.children[j].querySelector('.item-value').innerText);
                        priceText = currentShapeshiftElement.children[j].querySelector('.item-value').innerText;
                        ///金額が空欄かどうかのチェック
                        if (priceText == "") {
                            alert(`「${document.querySelectorAll('.change-target')[i].innerText}」タブの${j + 1}個目の金額が空欄です`);
                            /// ローディング画面を非表示
                            setLoadingStatus('none');
                            return;
                        }
                        ///===商品名
                        console.log(`***商品名`);
                        console.log(currentShapeshiftElement.children[j].querySelector('.item-name').innerText);
                        itemName = currentShapeshiftElement.children[j].querySelector('.item-name').innerText;
                        console.log(" itemName : ", itemName);
                        ///商品名が空欄かどうかのチェック
                        if (itemName == "") {
                            alert(`「${document.querySelectorAll('.change-target')[i].innerText}」タブの${j + 1}個目の商品名が空欄です`);
                            /// ローディング画面を非表示
                            setLoadingStatus('none');
                            return;
                        }
                        itemNameDuplicatedCheckArray.push(itemName);

                        ///他の商品名と重複がないかチェック
                        // checkDuplicate(itemNameDuplicatedCheckArray);
                        if (checkDuplicate(itemNameDuplicatedCheckArray)) {
                            alert(`商品名に重複があるようです。`)
                            /// ローディング画面を非表示
                            setLoadingStatus('none');
                            return;
                        }

                        // return;

                        ///===商品説明
                        console.log(`***商品説明`);
                        console.log(currentShapeshiftElement.children[j].querySelector('.item-description').innerText);
                        itemDescription = currentShapeshiftElement.children[j].querySelector('.item-description').innerText;
                        ///商品説明が空欄かどうかのチェック
                        if (itemDescription == "") {
                            alert(`「${document.querySelectorAll('.change-target')[i].innerText}」タブの${j + 1}個目の商品説明が空欄です`);
                            /// ローディング画面を非表示
                            setLoadingStatus('none');
                            return;
                        }

                        ///===原材料
                        console.log(`***原材料`);
                        console.log(currentShapeshiftElement.children[j].querySelector('.ingredients').innerText);
                        ingredientListText = currentShapeshiftElement.children[j].querySelector('.ingredients').innerText;
                        ///原材料が空欄かどうかのチェック
                        if (ingredientListText == "") {
                            alert(`「${document.querySelectorAll('.change-target')[i].innerText}」タブの${j + 1}個目の原材料が空欄です`);
                            /// ローディング画面を非表示
                            setLoadingStatus('none');
                            return;
                        }
                        ///===アレルゲン
                        console.log(`***アレルゲン`);
                        let allergenArray = [];

                        currentShapeshiftElement.children[j].querySelectorAll('.allergen-check').forEach((p, allergenIndex) => {
                            console.log(`allergenIndex : ${allergenIndex}`);
                            console.log(`currentShapeshiftElement.children[j].querySelectorAll('.allergen-check')[allergenIndex].checked : ${currentShapeshiftElement.children[j].querySelectorAll('.allergen-check')[allergenIndex].checked}`);
                            console.log(`currentShapeshiftElement.children[j].querySelectorAll('.inner-box-allergen')[allergenIndex].innerText : ${currentShapeshiftElement.children[j].querySelectorAll('.inner-box-allergen')[allergenIndex].innerText}`);

                            ///もしチェックがあったら
                            if (currentShapeshiftElement.children[j].querySelectorAll('.allergen-check')[allergenIndex].checked) {
                                allergenArray.push(currentShapeshiftElement.children[j].querySelectorAll('.inner-box-allergen')[allergenIndex].innerText);
                                // ///初めだけカンマをつけない
                                // // if (allergenIndex == 0) {
                                // ///初めての要素の時は
                                // if (allergenText == "") {
                                //     allergenText = currentShapeshiftElement.children[j].querySelectorAll('.inner-box-allergen')[allergenIndex].innerText;
                                // }
                                // else {
                                //     allergenText = allergenText + "・" + currentShapeshiftElement.children[j].querySelectorAll('.inner-box-allergen')[allergenIndex].innerText;
                                // }
                            }
                        });

                        console.log("登録するallergenArray : ", allergenArray);
                        // return;


                        // ///アレルゲンが何もなければ"なし"を入れる
                        // if (allergenText == "") {
                        //     allergenText = "なし"
                        // }
                        // console.log("allergenText : ", allergenText);

                        // ///===量の選択
                        // console.log(`***量の選択`);
                        // console.log("currentShapeshiftElement.children[j].querySelector('.amount').innerText : ", currentShapeshiftElement.children[j].querySelector('.amount').innerText);
                        // if (currentShapeshiftElement.children[j].querySelector('.amount').innerText == "Yes") 
                        // {
                        //     optionArray.push("amount");
                        // }


                        // ///===辛さの選択
                        // console.log(`***辛さの選択`);
                        // console.log("currentShapeshiftElement.children[j].querySelector('.spiciness').innerText : ", currentShapeshiftElement.children[j].querySelector('.spiciness').innerText);

                        // if (currentShapeshiftElement.children[j].querySelector('.spiciness').innerText == "Yes") 
                        // {
                        //     optionArray.push("spiciness");
                        // }


                        ///===トッピング
                        console.log(`***トッピング`);
                        /// Before
                        // console.log("currentShapeshiftElement.children[j].querySelectorAll('.topping-check') : " , currentShapeshiftElement.children[j].querySelectorAll('.topping-check'));
                        // currentShapeshiftElement.children[j].querySelectorAll('.topping-check').forEach((p, toppingIndex) => {
                        //     console.log("---inner-box-topping each");
                        //     console.log(`toppingIndex : ${toppingIndex}`);
                        //     console.log(`topping${toppingIndex}個目`);
                        //     // console.log(document.querySelectorAll('.inner-box-topping')[toppingIndex]);
                        //     // console.log(currentShapeshiftElement.children[j].querySelectorAll("topping-check")[toppingIndex].checked);
                        //     console.log(currentShapeshiftElement.children[j].querySelectorAll(".topping-check")[toppingIndex]);
                        //     // console.log(document.querySelectorAll('.inner-box-topping')[toppingIndex].innerText);
                        //     // console.log(document.querySelectorAll('.topping-check')[toppingIndex]);
                        //     // console.log(document.querySelectorAll('.topping-check')[toppingIndex].checked);
                        //     console.log(currentShapeshiftElement.children[j].querySelectorAll('.topping-check')[toppingIndex].checked);
                        //     console.log(currentShapeshiftElement.children[j].querySelectorAll('.inner-box-topping')[toppingIndex].innerText);
                        //     if (currentShapeshiftElement.children[j].querySelectorAll('.topping-check')[toppingIndex].checked) {
                        //         ///"ソーセージ"、などを配列に入れる
                        //         toppingArray.push(currentShapeshiftElement.children[j].querySelectorAll('.inner-box-topping')[toppingIndex].innerText)
                        //     }

                        //     console.log("---inner-box-topping each Fin");
                        // });

                        /// After
                        /// トッピングに関するchoices
                        let toppingChoices = [];

                        console.log("currentShapeshiftElement.children[j].querySelectorAll('.topping-check') : ", currentShapeshiftElement.children[j].querySelectorAll('.topping-check'));
                        currentShapeshiftElement.children[j].querySelectorAll('.topping-check').forEach((p, toppingIndex) => {
                            console.log("---inner-box-topping each");
                            console.log(`toppingIndex : ${toppingIndex}`);
                            console.log(`topping${toppingIndex}個目`);
                            // console.log(document.querySelectorAll('.inner-box-topping')[toppingIndex]);
                            // console.log(currentShapeshiftElement.children[j].querySelectorAll("topping-check")[toppingIndex].checked);
                            console.log(currentShapeshiftElement.children[j].querySelectorAll(".topping-check")[toppingIndex]);
                            // console.log(document.querySelectorAll('.inner-box-topping')[toppingIndex].innerText);
                            // console.log(document.querySelectorAll('.topping-check')[toppingIndex]);
                            // console.log(document.querySelectorAll('.topping-check')[toppingIndex].checked);
                            console.log(currentShapeshiftElement.children[j].querySelectorAll('.inner-box-topping')[toppingIndex].innerText);
                            console.log(currentShapeshiftElement.children[j].querySelectorAll('.topping-check')[toppingIndex].checked);
                            let toppingName = currentShapeshiftElement.children[j].querySelectorAll('.inner-box-topping')[toppingIndex].innerText;
                            let isThisToppingCheck = currentShapeshiftElement.children[j].querySelectorAll('.topping-check')[toppingIndex].checked;
                            let isThisToppingRecommendCheck = currentShapeshiftElement.children[j].querySelectorAll('.topping-recommend-check')[toppingIndex].checked;
                            if (isThisToppingCheck) {
                                ///"ソーセージ"、などを配列に入れる
                                // toppingArray.push(currentShapeshiftElement.children[j].querySelectorAll('.inner-box-topping')[toppingIndex].innerText)
                                toppingChoices.push({
                                    recommended: isThisToppingRecommendCheck,
                                    select_description: toppingName,
                                });
                            }

                            console.log("---inner-box-topping each Fin");
                        });

                        console.log("toppingChoices : ", toppingChoices);
                        // if (toppingChoices.length != 0) {
                        options.push({
                            choices: toppingChoices,
                            option_description: "トッピング",
                        });
                        // }
                        console.log("options : ", options);

                        // return;

                        ///===セール情報
                        console.log(`***セール情報`);
                        console.log("セール価格", currentShapeshiftElement.children[j].querySelector('.food-sale-price-value').innerText);
                        console.log("セール価格適用チェック", currentShapeshiftElement.children[j].querySelector('.food-sale-price-check').checked);
                        salePrice = currentShapeshiftElement.children[j].querySelector('.food-sale-price-value').innerText;
                        salePriceCheck = currentShapeshiftElement.children[j].querySelector('.food-sale-price-check').checked;
                        console.log("salePrice : ", salePrice);
                        console.log("salePriceCheck : ", salePriceCheck);
                        // return;

                        ///===消費するもの（consumptions）
                        /// まずは消費するもの（consumptions）に今回の商品を入れる
                        let consumptions = [];
                        consumptions.push({
                            consumption: 1,
                            stock_selection: itemName
                        });
                        ///===ご飯が含まれるかどうか
                        console.log(`***ご飯が含まれるかどうかのチェックボックスの情報`);
                        containRiceCheck = currentShapeshiftElement.children[j].querySelector('.contain-rice-check').checked;
                        /// ご飯があればご飯も追加
                        if (containRiceCheck) {
                            consumptions.push({
                                consumption: 1,
                                stock_selection: "rice"
                            });
                        }

                        ///===おすすめメニュー
                        console.log(`***おすすめメニューチェックボックス`);
                        menuRecommendedCheck = currentShapeshiftElement.children[j].querySelector('.recommended-menu-check').checked;

                        ///===内容量（g）
                        console.log(`***内容量（g）`);
                        console.log(currentShapeshiftElement.children[j].querySelector('.contents-gram-value').innerText);
                        contentsGramText = currentShapeshiftElement.children[j].querySelector('.contents-gram-value').innerText;
                        ///内容量が空欄かどうかのチェック
                        if (contentsGramText == "") {
                            alert(`「${document.querySelectorAll('.change-target')[i].innerText}」タブの${j + 1}個目の内容量が空欄です`);
                            /// ローディング画面を非表示
                            setLoadingStatus('none');
                            return;
                        }
                        ///===保存方法
                        console.log(`***保存方法`);
                        console.log(currentShapeshiftElement.children[j].querySelector('.preservation-text').innerText);
                        ///番号
                        preservationNumText = currentShapeshiftElement.children[j].querySelector('.preservation-num').innerText;
                        ///保存方法の番号が空欄かどうかのチェック
                        if (preservationNumText == "") {
                            alert(`「${document.querySelectorAll('.change-target')[i].innerText}」タブの${j + 1}個目の保存方法が指定されていません。`);
                            /// ローディング画面を非表示
                            setLoadingStatus('none');
                            return;
                        }
                        ///テキスト
                        preservationText = currentShapeshiftElement.children[j].querySelector('.preservation-text').innerText;
                        ///テキストの先頭のピリオドを削除する
                        preservationText = preservationText.slice(1);

                        ///===表示/非表示（isShow）のチェック
                        console.log(`***表示/非表示（isShow）のチェック`);
                        let isShowCheck = currentShapeshiftElement.children[j].querySelector('.is-show-check').checked;

                        /// オブジェクトの配列の中に検索項目があるかどうかを検索、あればオブジェクト、なければundefinedが帰ってくる
                        let searchResult = searchObj(registerCheckObj.stockDoc, itemName)
                        console.log('searchResult: ', searchResult);

                        /// 既に在庫があれば数値はそのまま、なければdefaultStock
                        let eachItemStock = 0;
                        if (searchResult) {
                            eachItemStock = searchResult['stock'];
                        }
                        else {
                            eachItemStock = defaultStock;
                        }

                        /// メイン商品を在庫管理リストに追加（非表示のものは在庫管理リストへも登録しない）
                        if (isShowCheck) {
                            stocksArray.push({
                                stock: eachItemStock,
                                stock_selection: itemName,
                            });
                        }


                        ///===クロップ猟奇情報
                        let crop_area = {
                            left: Number(currentShapeshiftElement.children[j].querySelector('.crop-left').dataset.left),
                            top: Number(currentShapeshiftElement.children[j].querySelector('.crop-top').dataset.top),
                            width: Number(currentShapeshiftElement.children[j].querySelector('.crop-width').dataset.width),
                            height: Number(currentShapeshiftElement.children[j].querySelector('.crop-height').dataset.height),
                        }

                        /// 汎用オプションに関するchoices
                        let generalOptionChoices = [];

                        // console.log("currentShapeshiftElement.children[j].querySelectorAll('.topping-check') : " , currentShapeshiftElement.children[j].querySelectorAll('.topping-check'));
                        console.log("currentShapeshiftElement.children[j].querySelectorAll('.topping-check') : ", currentShapeshiftElement.children[j].querySelectorAll('.inner-box-option-title-div'));
                        let innerBoxOptionDiv = currentShapeshiftElement.children[j].querySelectorAll('.inner-box-option-title-div');
                        innerBoxOptionDiv.forEach((p, generalOptionIndex) => {
                            ///ここはサイズ、辛さなど１つのオプション毎のループ
                            // console.log("---inner-box-generalOption each");
                            console.log(`generalOptionIndex : ${generalOptionIndex}`);
                            console.log(`generalOption${generalOptionIndex}個目`);

                            // // console.log(document.querySelectorAll('.inner-box-topping')[generalOptionIndex]);
                            // // console.log(currentShapeshiftElement.children[j].querySelectorAll("topping-check")[generalOptionIndex].checked);
                            // console.log(currentShapeshiftElement.children[j].querySelectorAll(".topping-check")[generalOptionIndex]);
                            // // console.log(document.querySelectorAll('.inner-box-topping')[generalOptionIndex].innerText);
                            // // console.log(document.querySelectorAll('.topping-check')[generalOptionIndex]);
                            // // console.log(document.querySelectorAll('.topping-check')[generalOptionIndex].checked);
                            // console.log(currentShapeshiftElement.children[j].querySelectorAll('.inner-box-topping')[generalOptionIndex].innerText);
                            // console.log(currentShapeshiftElement.children[j].querySelectorAll('.topping-check')[generalOptionIndex].checked);

                            /// 「サイズ」、「辛さ」など
                            let generalOptionName = currentShapeshiftElement.children[j].querySelectorAll('.inner-box-option-title')[generalOptionIndex].innerText;
                            console.log("generalOptionName : ", generalOptionName);
                            /// 例：小盛り、普通、大盛りなどのArray
                            let generalOptionNames = innerBoxOptionDiv[generalOptionIndex].querySelectorAll('.inner-box-option');
                            /// 例：商品自体のチェックボックスのArray
                            let generalOptionNameChecks = innerBoxOptionDiv[generalOptionIndex].querySelectorAll('.general-option-check');
                            console.log("DBG_generalOptionNameChecks : ", generalOptionNameChecks);
                            /// 例：「おすすめ」のタイトルのArray（現時点では使用しない）
                            // let  generalOptionRecommend = innerBoxOptionDiv[generalOptionIndex].querySelectorAll('.inner-box-option-reccomend');
                            /// 例：おすすめのチェックボックスのArray
                            let generalOptionRecommendChecks = innerBoxOptionDiv[generalOptionIndex].querySelectorAll('.general-option-recommend-check');
                            console.log("generalOptionNames : ", generalOptionNames);
                            generalOptionNames.forEach((p, generalOptionNameIndex) => {
                                ///===個別のオプション（例：小盛り、普通、など）
                                // console.log("generalOptionNames[generalOptionNameIndex] : " , generalOptionNames[generalOptionNameIndex]);
                                console.log("generalOptionNames[generalOptionNameIndex].innerText : ", generalOptionNames[generalOptionNameIndex].innerText);
                                /// 例：小盛り、普通、大盛りなど
                                let eachGeneralOptionName = generalOptionNames[generalOptionNameIndex].innerText;
                                console.log("eachGeneralOptionName : ", eachGeneralOptionName);

                                let eachGeneralEachOptionNameChecks = generalOptionNameChecks[generalOptionNameIndex].checked;
                                console.log("eachGeneralEachOptionNameChecks : ", eachGeneralEachOptionNameChecks);

                                /// 「おすすめ」という文字なので基本的には使わない
                                // let eachGeneralEachOptionRecommend = generalOptionRecommend[generalOptionNameIndex].innerText;
                                // console.log("eachGeneralEachOptionRecommend : " , eachGeneralEachOptionRecommend);

                                let eachGeneralEachOptionRecommendChecks = generalOptionRecommendChecks[generalOptionNameIndex].checked;
                                console.log("eachGeneralEachOptionRecommendChecks : ", eachGeneralEachOptionRecommendChecks);

                                if (eachGeneralEachOptionNameChecks) {
                                    ///"小盛り" , recommended:true、などを配列に入れる
                                    console.log("in eachGeneralEachOptionRecommendChecks : ", eachGeneralEachOptionRecommendChecks);
                                    console.log("in eachGeneralOptionName : ", eachGeneralOptionName);
                                    generalOptionChoices.push({
                                        recommended: eachGeneralEachOptionRecommendChecks,
                                        select_description: eachGeneralOptionName,
                                    });
                                }
                                // return;
                            });

                            console.log("generalOptionChoices : ", generalOptionChoices);
                            // if (generalOptionChoices.length != 0) {
                            options.push({
                                choices: generalOptionChoices,
                                option_description: generalOptionName,
                            });
                            console.log("general options : ", options);
                            // }
                            generalOptionChoices = [];
                        });

                        // return;

                        // ///===写真の登録
                        // let file = currentShapeshiftElement.children[j].querySelector('.food_img_file').files
                        // console.log(" file : ", file);
                        // // console.log(" files : " , files);
                        // let image = file[0];
                        // console.log(" image : ", image);
                        ///乱数の範囲の最大値、getRondomSuffix(rondomMaxValue)は0〜(rondomMaxValue - 1)の範囲の乱数を生成する
                        rondomMaxValue = 1000000000000;

                        // let restaurantCollection = db.collection(collection_name).doc(user.uid);

                        // console.log("■DBG12_処理中のタブ : ", document.querySelectorAll('.change-target')[i].innerText);
                        ///もし写真がセットされていないメニューがあったら、既にDBに画像データがあればその画像データのURLをそのまま登録、DBにデータがなく新しいデータだったら画像を入れる旨指示してやり直す（return）
                        // if (image != undefined) {
                        if (currentShapeshiftElement.children[j].querySelector('.is-image-renew-check').checked) {
                            console.log("新しい画像をDBへ登録");
                            /// 画像が新たにセットされたら新しい画像を登録
                            ///===画像をリサイズ -> canvasへDraw -> blobe形式への変換処理（fileからではなくpreviewImageの画像を取得して使用する）
                            ///===クロップ後の画像について
                            let targetImg = currentShapeshiftElement.children[j].querySelector('.menu-items');
                            // let orgWidth = targetImg.width; // 元の横幅を保存
                            // let orgHeight = targetImg.height; // 元の高さを保存
                            // console.log("orgWidth : ", orgWidth);
                            // console.log("orgHeight : ", orgHeight);
                            console.log("targetImg.type : ", targetImg.type);
                            let generateImg = new Image();
                            generateImg.src = targetImg.src;
                            console.log("generateImg : ", generateImg);
                            console.log("generateImg.width : ", generateImg.width);
                            console.log("generateImg.height : ", generateImg.height);
                            let blob = resizeAndToBlob(300, generateImg)

                            ///===元画像について
                            let targetORGImg = currentShapeshiftElement.children[j].querySelector('.org-menu-image');
                            let orgGenerateImg = new Image();
                            orgGenerateImg.src = targetORGImg.src;
                            console.log("orgGenerateImg : ", orgGenerateImg);
                            console.log("orgGenerateImg.width : ", orgGenerateImg.width);
                            console.log("orgGenerateImg.height : ", orgGenerateImg.height);
                            // let targetOrgsize = 0;
                            // if (orgGenerateImg.width > 1000) {}

                            let orgBlob = "";
                            /// 新しく元画像がセットされたかどうか
                            let isOrgImgReset = false;
                            /// orgGenerateImg（画像をPCから読み込んだ時に生成される）があれば
                            if (orgGenerateImg.width != 0) {
                                orgBlob = resizeAndToBlob(orgGenerateImg.width, orgGenerateImg)
                                console.log("orgBlob : ", orgBlob);
                                isOrgImgReset = true;
                            }
                            // /// orgGenerateImgがない（クロップの位置だけ変更した場合）
                            // else {
                            //     let tmpOrgImg = currentShapeshiftElement.children[j].querySelector('.org-img-url-text').innerText;
                            //     orgBlob = resizeAndToBlob(tmpOrgImg.width, tmpOrgImg)
                            //     console.log("orgBlob : " , orgBlob);
                            // }


                            // return;

                            let itemName = currentShapeshiftElement.children[j].querySelector('.item-name').textContent;

                            /// 画像が新たにセットされたら新しい画像を登録
                            /// クロップ画像のファイルパス（元画像とはランダムの数が異なるので同じ書き方でOK）
                            // let file_path = "Restaurants/" + user.uid + "/" + "menuImages/" + image.name + getRondomSuffix(rondomMaxValue);
                            let file_path = "Restaurants/" + user.uid + "/" + "menuImages/" + itemName + getRondomSuffix(rondomMaxValue);
                            /// 元画像のファイルパス（クロップ画像とはランダムの数が異なるので同じ書き方でOK）
                            let org_file_path = "Restaurants/" + user.uid + "/" + "menuImages/" + itemName + getRondomSuffix(rondomMaxValue);

                            console.log(" file_path : ", file_path);
                            let imgStorageRef = firebase.storage().ref().child(file_path);
                            console.log(" imgStorageRef : ", imgStorageRef);
                            let orgImgStorageRef = firebase.storage().ref().child(org_file_path);
                            console.log(" orgImgStorageRef : ", orgImgStorageRef);

                            /// 新しく元画像がセットされていたらorg画像もアップロード
                            if (isOrgImgReset) {
                                console.log("isOrgImgResetあり");
                                ///---imgの場合
                                // imgStorageRef.put(image).then(function(snapshot) {
                                ///---blobの場合
                                /// クロップ後の画像
                                imgStorageRef.put(blob).then(function (snapshot) {
                                    /// 元画像
                                    orgImgStorageRef.put(orgBlob).then(function (snapshot) {
                                        console.log("user.uid : ", user.uid);
                                        // alert('アップロードしました');

                                        // return;

                                        ///***入力画像のファイル名について、
                                        /// 半角スペース -> %20
                                        /// 全角スペース -> %E3%80%80
                                        /// 全角ひらがな -> 何らかの文字
                                        /// などに変換してくれるため、ここで入力チェックを行う必要はない
                                        ///**************
                                        // URLの確認（https://firebasestorage.〜）
                                        let imgStorageRef = firebase.storage().ref().child(file_path);
                                        let orgImgStorageRef = firebase.storage().ref().child(org_file_path);
                                        ///---imgの場合
                                        // imgStorageRef.getDownloadURL().then(function(img_url){
                                        ///---blobの場合
                                        imgStorageRef.getDownloadURL().then(imgUrl => {
                                            orgImgStorageRef.getDownloadURL().then(org_img_url => {
                                                imageSavedCount++;
                                                console.log("imgUrl : ", imgUrl);
                                                console.log("画像登録直後_imageSavedCount : ", imageSavedCount);
                                                /// このメニューの画像は初めての画像登録
                                                menu_map.push({
                                                    // [itemName]: {
                                                    menu_name: itemName,
                                                    consumptions: consumptions,
                                                    contents_gram: Number(contentsGramText),
                                                    sale_price: Number(salePrice),
                                                    is_sale: salePriceCheck,
                                                    description: itemDescription,
                                                    // halal_mark: false,
                                                    // local_consumption: false,
                                                    // vegan_mark: false,
                                                    // kids_ok: false,
                                                    ingredient_list: ingredientListText,
                                                    // allergen : allergenText,
                                                    allergen: allergenArray,
                                                    preservation: {
                                                        number: preservationNumText,
                                                        text: preservationText,
                                                    },
                                                    options: options,
                                                    type: document.querySelectorAll('.change-target')[i].innerText,
                                                    img_path: imgUrl,
                                                    img_info: {
                                                        org_img_url: org_img_url,
                                                        crop_area: crop_area
                                                    },
                                                    price: Number(priceText),
                                                    recommended_menu: menuRecommendedCheck,
                                                    is_show: isShowCheck,
                                                    // }
                                                });

                                                // console.log("menu_map length : ", Object.keys(menu_map["menu_map"]).length);
                                                console.log("menu_map length : ", Object.keys(menu_map).length);
                                                console.log("画像登録直後_menu_map : ", menu_map);

                                                /// 画像のURLが取得できたらDBへ登録の処理
                                                ///　ここから登録処理
                                                ///最後のデータを保存したら
                                                // if (Object.keys(menu_map).length == menuNumTotal) {
                                                if (Object.keys(menu_map).length == menuNumTotal) {
                                                    sortedMenuMap = sortMenuMap(menu_map);
                                                    updateMenus(sortedMenuMap, type_order, option_settings, restaurantCollection, stocksArray, topAdSlider);
                                                    // updateMenus(menu_map, type_order, option_settings, restaurantCollection, stocksArray, topAdSlider);
                                                    addToFullStockArrayDoc(stocksArray);
                                                }
                                            });
                                        });
                                    });
                                });
                            }
                            /// 新しく元画像がセットされていなかったらクロップした画像のみアップロード
                            else {
                                console.log("isOrgImgResetなし");
                                ///---imgの場合
                                // imgStorageRef.put(image).then(function(snapshot) {
                                ///---blobの場合
                                /// クロップ後の画像
                                imgStorageRef.put(blob).then(function (snapshot) {
                                    console.log("user.uid : ", user.uid);
                                    ///***入力画像のファイル名について、
                                    /// 半角スペース -> %20
                                    /// 全角スペース -> %E3%80%80
                                    /// 全角ひらがな -> 何らかの文字
                                    /// などに変換してくれるため、ここで入力チェックを行う必要はない
                                    ///**************
                                    // URLの確認（https://firebasestorage.〜）
                                    let imgStorageRef = firebase.storage().ref().child(file_path);
                                    // let orgImgStorageRef = firebase.storage().ref().child(org_file_path);
                                    ///---imgの場合
                                    // imgStorageRef.getDownloadURL().then(function(img_url){
                                    ///---blobの場合
                                    imgStorageRef.getDownloadURL().then(imgUrl => {
                                        imageSavedCount++;
                                        console.log("imgUrl : ", imgUrl);
                                        console.log("画像登録直後_imageSavedCount : ", imageSavedCount);
                                        /// このメニューの画像は初めての画像登録
                                        menu_map.push({
                                            // [itemName]: {
                                            menu_name: itemName,
                                            consumptions: consumptions,
                                            contents_gram: Number(contentsGramText),
                                            sale_price: Number(salePrice),
                                            is_sale: salePriceCheck,
                                            description: itemDescription,
                                            // halal_mark: false,
                                            // local_consumption: false,
                                            // vegan_mark: false,
                                            // kids_ok: false,
                                            ingredient_list: ingredientListText,
                                            // allergen : allergenText,
                                            allergen: allergenArray,
                                            preservation: {
                                                number: preservationNumText,
                                                text: preservationText,
                                            },
                                            options: options,
                                            type: document.querySelectorAll('.change-target')[i].innerText,
                                            img_path: imgUrl,
                                            img_info: {
                                                org_img_url: currentShapeshiftElement.children[j].querySelector('.org-img-url-text').innerText,
                                                crop_area: crop_area
                                            },
                                            price: Number(priceText),
                                            recommended_menu: menuRecommendedCheck,
                                            is_show: isShowCheck,
                                            // }
                                        });

                                        console.log("menu_map length : ", Object.keys(menu_map).length);
                                        console.log("画像登録直後_menu_map : ", menu_map);

                                        /// 画像のURLが取得できたらDBへ登録の処理
                                        ///　ここから登録処理
                                        ///最後のデータを保存したら
                                        // if (Object.keys(menu_map).length == menuNumTotal) {
                                        if (Object.keys(menu_map).length == menuNumTotal) {
                                            sortedMenuMap = sortMenuMap(menu_map);
                                            updateMenus(sortedMenuMap, type_order, option_settings, restaurantCollection, stocksArray, topAdSlider);
                                            // updateMenus(menu_map, type_order, option_settings, restaurantCollection, stocksArray, topAdSlider);
                                            addToFullStockArrayDoc(stocksArray);
                                        }
                                    });
                                });
                            }


                            // return;

                            // currentShapeshiftElement.children[i];
                            // console.log(`currentShapeshiftElement.children[i] : ${currentShapeshiftElement.children[i]}`);
                        } else {
                            console.log("画像に関しての変更なし");

                            console.log("既にDBに登録されている画像URL : ", currentShapeshiftElement.children[j].querySelector('.img-url-text').innerText);
                            if (currentShapeshiftElement.children[j].querySelector('.img-url-text').innerText == "") {
                                alert(`${document.querySelectorAll('.change-target')[i].innerText}タブの${j + 1}番目のメニューの写真がありません。`);
                                /// ローディング画面を非表示
                                setLoadingStatus('none');
                                return;
                            } else {
                                ///menu_mapの各項目をここで作成
                                console.log("DBの画像あり");
                                menu_map.push({
                                    // [itemName]: {
                                    menu_name: itemName,
                                    consumptions: consumptions,
                                    contents_gram: Number(contentsGramText),
                                    sale_price: Number(salePrice),
                                    is_sale: salePriceCheck,
                                    description: itemDescription,
                                    // halal_mark: false,
                                    // local_consumption: false,
                                    // vegan_mark: false,
                                    // kids_ok: false,
                                    ingredient_list: ingredientListText,
                                    // allergen : allergenText,
                                    allergen: allergenArray,
                                    preservation: {
                                        number: preservationNumText,
                                        text: preservationText,
                                    },
                                    options: options,
                                    type: document.querySelectorAll('.change-target')[i].innerText,
                                    img_path: currentShapeshiftElement.children[j].querySelector('.img-url-text').innerText,
                                    img_info: {
                                        org_img_url: currentShapeshiftElement.children[j].querySelector('.org-img-url-text').innerText,
                                        crop_area: crop_area
                                    },
                                    price: Number(priceText),
                                    recommended_menu: menuRecommendedCheck,
                                    is_show: isShowCheck,
                                    // }
                                });

                                ///最後のデータを保存したら
                                if (Object.keys(menu_map).length == menuNumTotal) {
                                    /// 画像の所の非同期処理によって順番が前後してしまうことがあるので、ボックスのメニューの名前順にソートしなおす
                                    // sortedMenuMap = sortMenuMap();
                                    sortedMenuMap = sortMenuMap(menu_map);
                                    console.log("Comp_sortedMenuMap : ", sortedMenuMap);
                                    updateMenus(sortedMenuMap, type_order, option_settings, restaurantCollection, stocksArray, topAdSlider);
                                    // updateMenus(menu_map, type_order, option_settings, restaurantCollection, stocksArray, topAdSlider);
                                    addToFullStockArrayDoc(stocksArray);
                                }
                            }
                        }
                    }
                }
                //     } else {
                //       // No user is signed in.
                //       console.log("サインインがされていません");
                //     }
                //   });

            } else {
                // alert("ログインユーザーなし");
            }
        });
        // };
    });

    jQuery(function ($) {
        ///===トッピング項目の編集
        $(document).on("click", ".topping-edit", function () {
            let txt = "";
            console.log("$(this).parent() : ", $(this).parent());
            console.log("$(this).parent().find('.topping-general-text') : ", $(this).parent().find('.topping-general-text'));
            if (!$(this).parent().find('.topping-general-text').hasClass('on')) {
                console.log("onなし");
                $(this).parent().find('.topping-general-text').addClass('on');
                txt = $(this).parent().find('.topping-general-text').text();
                $(this).parent().find('.topping-general-text').html('<input type="text" value="' + txt + '" />');
            }
            ///編集中に編集をクリックしたときに処理を止める
            else {
                console.log("onあり");
                return;
            }
            //テキストをinputのvalueに入れてで置き換え
            $(this).parent().find('.topping-general-text').html('<input type="text" value="' + txt + '" />');

            let inputDefaultValue = $(this).parent().find('input').val()

            $(this).parent().find('.topping-general-text > input').focus().blur(function () {
                console.log("Focus blur");
                console.log($(this).parent().find('.topping-general-text'));
                let inputVal = $(this).parent().find('input').val();

                console.log("inputVal : ", inputVal);
                //もし空欄だったら空欄にする前の内容に戻す
                if (inputVal === '') {
                    console.log("空白");
                    // inputVal = this.defaultValue;
                    // inputVal = $(this).parent().find('input').defaultValue;
                    console.log("空白時のinputVal : ", inputVal);
                    console.log("空白時のinputDefaultValue : ", inputDefaultValue);
                    inputVal = inputDefaultValue;
                };
                $(this).parent().removeClass('on').text(inputVal);
            });
        });

        ///===タブの項目の編集
        // $('.tab-edit').click(function(){
        $(document).on("click", ".tab-edit", function () {
            let txt = "";
            console.log("$(this).parent() : ", $(this).parent());
            if (!$(this).parent().find('.change-target').hasClass('on')) {
                console.log("onなし");
                $(this).parent().find('.change-target').addClass('on');
                // let txt = $(this).text();
                txt = $(this).parent().find('.change-target').text();
                // $(this).html('<input type="text" value="'+txt+'" />');
                // $(this).parent().html('<input type="text" value="'+txt+'" />');
                $(this).parent().find('.change-target').html('<input type="text" value="' + txt + '" />');
            }
            ///編集中に編集をクリックしたときに処理を止める
            else {
                console.log("onあり");
                return;
            }
            //テキストをinputのvalueに入れてで置き換え
            // $(this).html('<input type="text" value="'+txt+'" />');
            $(this).parent().find('.change-target').html('<input type="text" value="' + txt + '" />');
            //同時にinputにフォーカスをする
            // $('.tab-edit > input').focus().blur(function(){

            let inputDefaultValue = $(this).parent().find('input').val()

            $(this).parent().find('.change-target > input').focus().blur(function () {
                console.log("Focus blur");
                console.log($(this).parent().find('.change-target'));
                let inputVal = $(this).parent().find('input').val();

                console.log("inputVal : ", inputVal);
                //もし空欄だったら空欄にする前の内容に戻す
                if (inputVal === '') {
                    console.log("空白");
                    // inputVal = this.defaultValue;
                    // inputVal = $(this).parent().find('input').defaultValue;
                    console.log("空白時のinputVal : ", inputVal);
                    console.log("空白時のinputDefaultValue : ", inputDefaultValue);
                    inputVal = inputDefaultValue;
                };
                //編集が終わったらtextで置き換える
                $(this).parent().removeClass('on').text(inputVal);
            });
        });

        ///===オプションの項目の編集
        // $(document).on("click", ".option-text-edit , ", function(){
        // $(document).on("click", ".option-text-edit", function(){
        $(document).on("click", ".option-text-edit", function () {
            let txt = "";
            console.log("$(this).parent() : ", $(this).parent());
            console.log("$(this).parent().find('.option-text') : ", $(this).parent().find('.option-text'));
            if (!$(this).parent().find('.option-text').hasClass('on')) {
                console.log("onなし");
                $(this).parent().find('.option-text').addClass('on');
                txt = $(this).parent().find('.option-text').text();
                $(this).parent().find('.option-text').html('<input type="text" value="' + txt + '" />');
            }
            ///編集中に編集をクリックしたときに処理を止める
            else {
                console.log("onあり");
                return;
            }
            //テキストをinputのvalueに入れてで置き換え
            $(this).parent().find('.option-text').html('<input type="text" value="' + txt + '" />');

            let inputDefaultValue = $(this).parent().find('input').val()

            $(this).parent().find('.option-text > input').focus().blur(function () {
                console.log("Focus blur");
                console.log($(this).parent().find('.option-text'));
                let inputVal = $(this).parent().find('input').val();

                console.log("inputVal : ", inputVal);
                //もし空欄だったら空欄にする前の内容に戻す
                if (inputVal === '') {
                    console.log("空白");
                    // inputVal = this.defaultValue;
                    // inputVal = $(this).parent().find('input').defaultValue;
                    console.log("空白時のinputVal : ", inputVal);
                    console.log("空白時のinputDefaultValue : ", inputDefaultValue);
                    inputVal = inputDefaultValue;
                };
                //編集が終わったらtextで置き換える
                // $(this).parent().removeClass('on').text(inputVal);
                // $(this).parent().find('.amount-type-text').removeClass('on').text(inputVal);
                // $(this).parent().parent().removeClass('on').text(inputVal);
                // $(this).parent().parent().removeClass('on').text("DBG");
                // $(this).parent().parent().removeClass('on');

                /// $(this).parent()がspan
                // $(this).parent().removeClass('on').text("DBG");
                // $(this).parent().removeClass('on').defaultValue;
                $(this).parent().removeClass('on').text(inputVal);
            });
        });
    });

    function updateBlockName() {
        // 順番を入れ替えられている時のため、nameを更新して、画像を更新するブロック番号を合わせる
        document.querySelectorAll('.food_img_file').forEach((p, index) => {
            // console.log("===");
            // console.log(`index : ${index}`);
            // console.log(document.querySelectorAll('input[class="food_img_file"]')[index].name);
            document.querySelectorAll('input[class="food_img_file"]')[index].name = index + 1;
            // console.log("===");
        });
    }

    let generateDateArray = (currentDate) => {
        // todaysDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 26, 0, 0, 0, 0);
        // console.log("todaysDate : " , todaysDate);
        const stockDateArray = [];
        const stockDateRange = 31;
        // const stockDateRange = 16;
        // const stockDateRange = 6;
        console.log("i = " + i);
        for (let i = 0; i < stockDateRange; i++) {
            todaysDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + i, 0, 0, 0, 0);
            // console.log("todaysDate : ", todaysDate);
            stockDateArray.push(todaysDate);
        }
        return stockDateArray;
    };

    const deleteOldStockDoc = (docToBeDeletedArray) => {
        console.log("deleteOldStockDoc");
        return new Promise((resolve, reject) => {
            for (let i = 0; i < docToBeDeletedArray.length; i++) {
                let docRef = db.collection(collection_name).doc(userGlobal.uid).collection('stocks').doc(docToBeDeletedArray[i]);
                docRef.delete()
                    .then(() => {
                    }).catch((error) => {
                        console.log(`Falied to delete DB (${error})`);
                        reject();
                    });
            }
            resolve(true)
        });
    };

    function getDateToBeDeleted() {
        let currentDate = new Date()
        baseDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1, currentDate.getHours(), currentDate.getMinutes(), currentDate.getMinutes(), currentDate.getMilliseconds());
        console.log("baseDate : ", baseDate);
        return new Promise((resolve, reject) => {
            // let docRef = db.collection(collection_name).doc(userGlobal.uid).collection('stocks');
            // let docRef = db.collection(collection_name).doc(userGlobal.uid).collection('stocks').where("targetDate", ">=", baseDate);
            let docRef = db.collection(collection_name).doc(userGlobal.uid).collection('stocks').where("targetDate", "<=", baseDate);
            docRef.get()
                .then((snapshot) => {
                    console.log("snapshot : ", snapshot);
                    let docToBeDeletedArray = [];
                    snapshot.forEach((doc) => {
                        if (doc.exists) {
                            console.log("doc.id : ", doc.id);
                            console.log("doc.data() : ", doc.data());
                            console.log("doc.data()['stocks'] : ", doc.data()['stocks']);
                            console.log("doc.data()['targetDate'] : ", doc.data()['targetDate']);
                            // resolve(doc.data())
                            // resolve(doc.data()['stocks'])
                            // resolve(doc.data()['targetDate'])
                            // docToBeDeletedArray.push(doc.data()['targetDate'])
                            docToBeDeletedArray.push(doc.id)
                        } else {
                            // resolve(registerCheckObj);
                            console.log("DBG15_No such document!");
                        }
                    })
                    // console.log("docToBeDeletedArray: ", docToBeDeletedArray)
                    resolve(docToBeDeletedArray)
                }).catch(function (error) {
                    // resolve(registerCheckObj);
                    reject();
                    console.log("Error getting document:", error);
                });
        });
    }

    function filterIntoOnlyNonExistDateArray(targetGeneratedArray) {
        return new Promise((resolve, reject) => {
            console.log("filterIntoOnlyNonExistDateArray");
            const onlyNonExistDateArray = []
            let docRef = db.collection(collection_name).doc(userGlobal.uid).collection('stocks');
            docRef.get()
                .then((snapshot) => {
                    console.log("snapshot : ", snapshot);
                    let docToBeDeletedArray = [];
                    // 比較用にtargetGeneratedArrayをTime(数値)に変換
                    let targetTimeList = targetGeneratedArray.map(value => value.getTime())
                    console.log("targetTimeList : ", targetTimeList);

                    snapshot.forEach((doc) => {
                        if (doc.exists) {
                            // console.log("doc.id : ", doc.id);
                            // console.log("doc.data()['targetDate'] : ", doc.data()['targetDate']);
                            // console.log("doc.data()['targetDate'].toDate() : ", doc.data()['targetDate'].toDate());
                            // console.log("targetGeneratedArray : ", targetGeneratedArray);
                            // console.log("targetGeneratedArray[0] : ", targetGeneratedArray[0]);
                            // console.log("typeof(targetGeneratedArray[0]) : ", typeof (targetGeneratedArray[0]));
                            // console.log("targetGeneratedArray.includes(targetDate) : ", targetGeneratedArray.includes(doc.data()['targetDate'].toDate()));
                            // console.log("typeof(doc.data()['targetDate'].toDate()) : ", typeof (doc.data()['targetDate'].toDate()));
                            // console.log("targetGeneratedArray[0] : " , targetGeneratedArray[0]);
                            console.log("doc.data()['targetDate'].toDate() : ", doc.data()['targetDate'].toDate());
                            console.log("targetGeneratedArray[0] == doc.data()['targetDate'].toDate()  : ", targetGeneratedArray[0] == doc.data()['targetDate'].toDate());
                            console.log("targetGeneratedArray[0] === doc.data()['targetDate'].toDate()  : ", targetGeneratedArray[0] === doc.data()['targetDate'].toDate());
                            console.log("doc.data()['targetDate'].toDate().getTime() : ", doc.data()['targetDate'].toDate().getTime());
                            console.log("targetGeneratedArray[0].getTime() : ", targetGeneratedArray[0].getTime());
                            console.log("targetGeneratedArray[0].getTime() == doc.data()['targetDate'].toDate().getTime())  : ", targetGeneratedArray[0].getTime() == doc.data()['targetDate'].toDate().getTime());
                            // docToBeDeletedArray.push(doc.id)
                            console.log("targetTimeList.includes(doc.data()['targetDate'].toDate().getTime()) : ", targetTimeList.includes(doc.data()['targetDate'].toDate().getTime()));
                            targetTimeList = targetTimeList.filter(value => value !== doc.data()['targetDate'].toDate().getTime());

                            // if(targetTimeList.includes(doc.data()['targetDate'].toDate().getTime())) {

                            // }
                        } else {
                            // resolve(registerCheckObj);
                            console.log("DBG15_No such document!");
                        }
                    })
                    const filteredIntoOnlyToBeAddedTimeList = targetTimeList.map(value => new Date(value))
                    console.log("filteredIntoOnlyToBeAddedTimeList: ", filteredIntoOnlyToBeAddedTimeList)

                    // console.log("docToBeDeletedArray: ", docToBeDeletedArray)
                    resolve(filteredIntoOnlyToBeAddedTimeList)
                }).catch(function (error) {
                    // resolve(registerCheckObj);
                    reject();
                    console.log("Error getting document:", error);
                });
        });
    }

    function setOneDayStockDoc(stocksArray, targetDate) {
        let docRef = db.collection(collection_name).doc(userGlobal.uid).collection('stocks').doc()
        // date = new Date(2022, 11, 0, 0, 0, 0, 0);
        docRef.set({
            stocks: stocksArray,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            targetDate: targetDate
        })
            .then(() => {
                console.log("setOneDayStockDoc");
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
    }

    function registerAllDateStockDoc(stocksArray, onlyNonExistDateArray) {
        console.log("---registerAllDateStockDoc");
        console.log("onlyNonExistDateArray : ", onlyNonExistDateArray);
        console.log("before_stocksArray : ", stocksArray);
        // let afterStocksArray = stocksArray.map(value => {
        //     // console.log("value :", value)
        //     value['stock'] = 0
        // })
        let afterStocksArray = stocksArray.map(value => value['stock'] = 0)
        console.log("after_afterStocksArray : ", afterStocksArray);
        for (let i = 0; i < onlyNonExistDateArray.length; i++) {
            let docRef = db.collection(collection_name).doc(userGlobal.uid).collection('stocks').doc()
            docRef.set({
                stocks: stocksArray,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                targetDate: onlyNonExistDateArray[i]
            })
                .then(() => {
                    console.log("registerAllDateStockDoc complete for one doc");
                    // console.log("registerAllDateStockDoc");
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
        }

    }

    async function addToFullStockArrayDoc(stocksArray) {
        console.log("addToFullStockArrayDoc");
        let currentDate = new Date()
        // console.log('currentDate : ', currentDate);
        // console.log('currentDate.getFullYear() : ', currentDate.getFullYear());
        // console.log('currentDate.getMonth() : ', currentDate.getMonth());
        // console.log('currentDate.getDate() : ', currentDate.getDate());
        // console.log('currentDate.getDay() : ', currentDate.getDay());
        // console.log('currentDate.getHours() : ', currentDate.getHours());
        // console.log('currentDate.getMinutes() : ', currentDate.getMinutes());
        // console.log('currentDate.getSeconds() : ', currentDate.getSeconds());
        // console.log('currentDate.getMilliseconds() : ', currentDate.getMilliseconds());
        // todaysDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0, 0);
        // todaysDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0, 0);
        // 

        // getAllStockDoc();
        //Create Array of Date to be generated
        const targetGeneratedArray = generateDateArray(currentDate);
        console.log("targetGeneratedArray : ", targetGeneratedArray);
        //GetDateToBeDeleted
        const docToBeDeletedArray = await getDateToBeDeleted()
        console.log("docToBeDeletedArray : ", docToBeDeletedArray)
        // //Delete old doc
        const checkCode1 = await deleteOldStockDoc(docToBeDeletedArray)
        console.log("checkCode1 : ", checkCode1);

        //Remove already exist date array
        const onlyNonExistDateArray = await filterIntoOnlyNonExistDateArray(targetGeneratedArray)
        console.log("onlyNonExistDateArray : ", onlyNonExistDateArray);

        // Register
        // setOneDayStockDoc(stocksArray, targetGeneratedArray[0])
        // setOneDayStockDoc(stocksArray, targetGeneratedArray[1])
        // setOneDayStockDoc(stocksArray, targetGeneratedArray[2])
        // setOneDayStockDoc(stocksArray, targetGeneratedArray[3])
        // setOneDayStockDoc(stocksArray, targetGeneratedArray[4])
        // setOneDayStockDoc(stocksArray, targetGeneratedArray[5])

        registerAllDateStockDoc(stocksArray, onlyNonExistDateArray)

        // return;
    };

    //===ファイルから選択
    function foodImgPreView(event, value) {
        // 順番を入れ替えられている時のため、nameを更新して、画像を更新するブロック番号を合わせる
        updateBlockName();

        console.log("DBG17");
        console.log("value : ", value);
        console.log("value.name : ", value.name);
        console.log("typeof(value.name) : ", typeof (value.name));
        console.log("value.name : ", value.name);
        console.log("typeof(Number(value.name)) : ", typeof (Number(value.name)));
        // console.log("typeof(value.name) : ", typeof(value.name));

        let index_changed = Number(value.name);

        // $(this).val();
        // console.log($(this).val());
        console.log($(this));
        console.log($(event));

        // console.log("===IMG");
        let file = event.target.files[0];
        let reader = new FileReader();
        // let preview = document.getElementById("test_food_img");
        // let preview = document.getElementsByClassName("test_food_img");
        let preview = document.getElementsByClassName("test_food_img");

        reader.onload = function (event) {
            for (index = 0; index < preview.length; ++index) {
                console.log("index : ", index);
                console.log("index_changed : ", index_changed);
                // console.log("DBG_index : ", DBG_index);
                if (index + 1 == index_changed) {
                    // console.log("DBG18");
                    console.log(index, "を変更");
                    preview[index].setAttribute("src", reader.result);
                }
            }
        };

        reader.readAsDataURL(file);

        // console.log("===IMG Fin");
    }

    //===ファイルから選択
    function cropImgPreView(event, value) {
        /// Cropperが準備できるまでローディング画面を表示
        setLoadingStatus('');

        console.log("DBG17");
        console.log("value : ", value);
        console.log("value.name : ", value.name);
        console.log("typeof(value.name) : ", typeof (value.name));
        console.log("value.name : ", value.name);
        console.log("typeof(Number(value.name)) : ", typeof (Number(value.name)));
        // console.log("typeof(value.name) : ", typeof(value.name));

        let index_changed = Number(value.name);
        console.log("index_changed : ", index_changed);
        console.log("currentCropClickedIndex : ", currentCropClickedIndex);

        console.log($(this));
        console.log($(event));

        // console.log("===IMG");
        let file = event.target.files[0];
        let reader = new FileReader();
        // let preview = document.getElementById("test_food_img");
        // let preview = document.getElementsByClassName("test_food_img");
        // let preview = document.getElementsByClassName("test_food_img");
        reader.onload = function (event) {
            cropper.replace(reader.result);
            /// 該当するボックスの新規画像追加チェックをTrueに
            document.querySelectorAll('.is-image-renew-check')[currentCropClickedIndex].checked = true;
            document.getElementById("org-img-in-modal").src = reader.result;

            for (index = 0; index < preview.length; ++index) {
                console.log("index : ", index);
                console.log("index_changed : ", index_changed);
                // console.log("DBG_index : ", DBG_index);
                if (index + 1 == index_changed) {
                    // console.log("DBG18");
                    console.log(index, "を変更");
                    // preview[index].setAttribute("src", reader.result);
                    /// 画像を今回対象の画像へ入れ替える
                    // cropper.replace(reader.result);
                }
            }
        };

        reader.readAsDataURL(file);

        // console.log("===IMG Fin");
    }

    // Make tab UI activated using below script  
    let $tabs = $('#menu-tabs').tabs();

    // Open jQuery Dialog to open modal popup - here we ask for tab name from user  
    $("#showDialog").click(function () {
        $("#divDialog input").val("").focus();
        $("#divDialog").dialog({
            title: 'New Tab',
            modal: true,
            open: function () {
                $('.ui-widget-overlay').addClass('custom-overlay');
            }
        });
    });

    // Adding new Tab on button click  
    $("#addTabs").click(function () {
        // Checking textbox is empty or not  
        if ($.trim($("#divDialog input").val()) == "") {
            $("#divDialog input").val("").focus();
        } else {
            // Checking tab name already exist or not  
            let tabNameExists = false;
            $('#menu-tabs ul li a').each(function (i) {
                if ($.trim(this.text.toLowerCase()) == $.trim($("#divDialog input").val().toLowerCase())) {
                    tabNameExists = true;
                }
            });

            //code to insert new tab here if tab name does not exist  
            if (!tabNameExists) {
                // Here we are getting max id so that we can assing new id to new tab  
                let maxid = 0;
                maxTabNum = 5;
                $('#menu-tabs ul li').each(function () {
                    let value = parseInt($(this).attr('id'));
                    maxid = (value > maxid) ? value : maxid;
                });

                let newid = maxid + 1;

                /// タブの数を制限する場合
                if (maxid >= maxTabNum) {
                    alert(`タブの数は最大${maxTabNum}個です。`)
                    return;
                }

                console.log("newid : ", newid);
                let shapeshift_id = "shapeshift_" + String(newid);
                console.log("shapeshift_id : ", shapeshift_id);
                console.log(`<div id="${shapeshift_id}">`);

                let generate_sentence =
                    `\
                        <div id="${shapeshift_id}">\
                            ${menu_div_code}\
                        </div>\
                        <button class="btn add-button menu-add btn btn-success"><i class="fa fa-plus-circle" aria-hidden="true"></i> メニュー追加</button>
                    `

                ///タブ自体
                $("#menu-tabs ul").append(
                    `
                    <li id="${newid}"><a href="#tab-${newid}"><span id="tab${newid}" class="change-target">${$("#divDialog input").val()}</span><span class="tab-edit"><i class="fas fa-pen"></i></span></a></li>
                    `
                );

                ///タブの中身
                $("#menu-tabs").append(
                    "<div style='display:none;' id='tab-" + newid + "'>" +
                    generate_sentence +
                    "</div>"
                );

                // Refreshing the tab as we have just added new tab  
                $("#menu-tabs").tabs("refresh");
                // Make added tab active  
                $("#menu-tabs").find('li a[href="#tab-' + newid + '"]').trigger("click");
                $("#divDialog").dialog("close");

                //更新
                $("#" + shapeshift_id).shapeshift();
                // $("#shapeshift_2").shapeshift();
                // alert("タブを追加");

                ///各タブのボックス数を表す配列に１項目追加（初期はボックスが1個なので中身は1）
                orgEachTabBox.push(1);
                addToppingOption();
                // currentEachTabBox.push(1);
                // alert(currentEachTabBox)
            } else {
                // Showing message if tab name already exist  
                alert("既に同じ名前のタブが存在します。別の名前を指定してください。");
                $("#divDialog input").focus();
            }
            updateMenuOptionAction();
        }
    });

    // Remove Active Tab on button click  
    $("#removeTabs").click(function () {
        // Confirm from user that he/she sure wants to delete this active tab  
        if (window.confirm("選択中のタブを削除しますか？")) {
            // Find name of Tab by attribute id  
            let tabIndex = $("#menu-tabs .ui-tabs-panel:visible").attr("id");

            // Removing Li and as well as content Div for the specific Tab  
            $("#menu-tabs").find(".ui-tabs-nav li a[href='#" + tabIndex + "']").parent().remove();
            $("#menu-tabs").find("div[id=" + tabIndex + "]").remove();

            // One removing process done we refresh the tab again  
            $("#menu-tabs").tabs("refresh");

            alert("タブを削除");
            ///各タブのボックス数を表す配列に１項目追加（初期はボックスが1個なので中身は1）
            orgEachTabBox.pop();
            // currentEachTabBox.pop();
            // alert(currentEachTabBox)
        }
    });

    // Here we are making jQuery Tabs (li tag) Sortable
    $(function () {
        $("#menu-tabs ul").sortable({ containment: "#menu-tabs ul" });
        $("#menu-tabs ul").disableSelection();
    });

    // $$("#menu-tabs ul").on('click', function() {
    //   alert("クリックされました");
    // });

    // ************ 2 ways to getting sorting order *************  

    /// タブの順番を入れ替えたときの処理
    // We can get sort order directly once you done sort by drag & drop  
    $("#menu-tabs ul").bind("sortupdate", function (event, ui) {
        event.stopPropagation();
        // alert($("#menu-tabs ul").sortable('toArray'));
        // alert(`currentEachTabBox : ${currentEachTabBox}`)
        // alert(`DBG_入れ替え`)
    });

    // Another way of getting current sort order of tab using below script  
    $("#showSortable").click(function () {
        alert("Sort : " + $("#menu-tabs ul").sortable('toArray'));
        alert(`currentEachTabBox : ${currentEachTabBox}`)
        // alert(`currentEachTabBox : ${currentEachTabBox}`)
    });

    $(function () {
        ///fadeInの方はdocument.getElementsByClassName('menu-option')[index].onclick = function() {の中で行う
        // $('#openModal').click(function(){
        //     $('#modalArea').fadeIn();
        // });
        $('#closeModal , #modalBg').click(function () {
            /// 入力されたフォームから各パーツへデータを移動
            syncFormToFrontMenuBox();
            $('#modalArea').fadeOut();
        });

        /// クロップのモーダルを閉じるまたはOKを押したとき
        $('#closeCropModal , #cropModalBg').click(function () {
            console.log("===Close Process");
            console.log("currentCropClickedIndex : ", currentCropClickedIndex);

            /// もし写真の変更がなければそのまま閉じるだけ
            if (cropper.getCroppedCanvas() != null) {
                resultImgUrl = cropper.getCroppedCanvas().toDataURL();
                console.log("resultImgUrl : ", resultImgUrl);
                ///===DBG:切り抜いた画像のプレビュー
                // var result = document.getElementById('result-img');
                // result.src = resultImgUrl;
                /// 該当する商品のボックスの画像を入れ替える
                document.querySelectorAll('.menu-items')[currentCropClickedIndex].src = resultImgUrl;
            }

            // if (document.getElementById("org-img-in-modal").src.length == 0) {

            ///もしDBから画像をとってきていて、フロントから画像はとってきたとき、ファイルから読み込んだ画像を表示するimg(org-img-in-modal)が空になるので、そのときはフロント側へorg画像を渡さない
            if (!$("#org-img-in-modal").attr("src")) {
                console.log("org-img-in-modalは空です");
            } else {
                console.log("org-img-in-modalは空じゃないです");
                console.log("DBG_1.src : ", document.getElementById("org-img-in-modal").src);
                document.querySelectorAll('.org-menu-image')[currentCropClickedIndex].src = document.getElementById("org-img-in-modal").src;
            }

            // document.getElementById("org-img-in-modal").src = ;
            // document.querySelectorAll('.menu-items')[currentCropClickedIndex].src = document.querySelectorAll('.org-img-url-text')[currentCropClickedIndex].innerText;
            /// 写真の更新ありにチェック
            document.querySelectorAll('.is-image-renew-check')[currentCropClickedIndex].checked = true;

            console.log("＝＝＝1");

            ///モーダルで指定したクロップ領域をUI側に反映
            console.log("modal_left : ", cropper.getCropBoxData()["left"]);
            console.log("DBG-left : ", document.querySelectorAll('crop-left')[currentCropClickedIndex]);
            console.log("DBG-left2 : ", document.querySelectorAll('.crop-left')[currentCropClickedIndex].dataset.left);

            document.querySelectorAll('.crop-left')[currentCropClickedIndex].dataset.left = cropper.getCropBoxData()["left"];
            document.querySelectorAll('.crop-top')[currentCropClickedIndex].dataset.top = cropper.getCropBoxData()["top"];
            document.querySelectorAll('.crop-width')[currentCropClickedIndex].dataset.width = cropper.getCropBoxData()["width"];
            document.querySelectorAll('.crop-height')[currentCropClickedIndex].dataset.height = cropper.getCropBoxData()["height"];

            console.log("＝＝＝2");

            /// マイナス値はダミーの値
            currentCropClickedIndex = -1;

            /// これだとdisplayがnoneになってしまいcropperの表示がおかしくなる
            // $('#cropModalWindow').fadeOut();
            /// visibilityの方を変える
            imageCropModalElement.style.visibility = "hidden";
        });
    });

    //   document.getElementsByClassName('menu-option')[0].onclick = function() {
    //     console.log("クリック")
    //     updateMenuOptionAction()
    //   }
    //   document.getElementsByClassName('menu-option')[1].onclick = function() {
    //     console.log("クリック")
    //     updateMenuOptionAction()
    //   }

    /// 
    // let enteredItemValue = 0;
    let currentIndex = 0;

    /// トッピングリストが変わったので、トッピングに関する各ボックスと入力モーダルフォームの情報をリセットする
    function resetToppingOption() {
        console.log("resetToppingOption");
        ///ボックスないのトッピングの文字
        let toppingStr = "";
        ///ポップアップウィンドウへ入れる文字
        let toppingShowStr = "";

        $("#form-topping-option").empty();

        /// TODO: ↓現状はここで全てに、空の状態のトッピングリストを入れているが、既存の情報を読んで比較することによって、
        /// 元のデータを保持して差分のみを追加するような形にできるとbetter

        ///トッピングテーブルからデータを取得し、フロントのボックスに入れるHTMLを作成
        $(".topping-item").each(function (index, data) {
            console.log('resetToppingOption()内インデックス番号:' + index + '、テキスト:' + $(data).text());
            toppingStr = toppingStr +
                `
            <div class="topping-front-one-set">
                <label class="">
                    <input type="checkbox" class="topping-check hidden-org-checkbox" disabled="disabled" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-topping">${$(data).text()}</span>
                </label>
                <label class="">
                    <input type="checkbox" class="topping-recommend-check hidden-org-checkbox" disabled="disabled" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-topping-reccomend">おすすめ！</span>
                </label>
            </div>
            `;

            toppingShowStr = toppingShowStr +
                `
            <div class="topping-front-one-set">
                <label class="">
                    <input type="checkbox" class="topping-check-show hidden-org-checkbox" disabled="disabled" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-topping">${$(data).text()}</span>
                </label>
                <label class="">
                    <input type="checkbox" class="topping-recommend-check-show hidden-org-checkbox" disabled="disabled" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-topping-reccomend">おすすめ！</span>
                </label>
            </div>
            `;

            console.log("toppingStr : ", toppingStr);
        });

        console.log("toppingStr : ", toppingStr);
        /// ここがフロントのメニューBOXのトッピングのチェックなどを表示させる場所
        /// フロント側ボックス全てに先ほど作成した同じ文字列（HTML）を挿入
        document.querySelectorAll('.topping').forEach((p, index) => {
            console.log('DBG2_p:' + p + '、DBG2_index:' + $(index).text());
            // document.querySelectorAll('.topping')[index].textContent = "test";
            // document.querySelectorAll('.topping-all-show')[index].textContent = "test";
            document.querySelectorAll('.topping')[index].innerHTML = toppingStr;
            document.querySelectorAll('.topping-all-show')[index].innerHTML = toppingShowStr;
        });
    }

    /// オプションをリセット
    function resetOption() {
        console.log("resetOption");
        let optionTitle = "";
        ///ボックスないのトッピングの文字
        let generalOptionStr = "";
        ///ポップアップウィンドウへ入れる文字
        let generalOptionShowStr = "";

        $("#form-general-option").empty();

        /// TODO: ↓現状はここで全てに、空の状態のトッピングリストを入れているが、既存の情報を読んで比較することによって、
        /// 元のデータを保持して差分のみを追加するような形にできるとbetter

        console.log("DBG6_option-setting-box : ", document.querySelectorAll('.option-setting-box'));
        /// -> サイズ、辛さ、硬さ、などの大項目のリスト
        document.querySelectorAll('.option-setting-box').forEach((p, optionSettingBoxIndex) => {
            console.log("optionSettingBoxIndex : ", optionSettingBoxIndex);
            console.log("document.querySelectorAll('.option-setting-box')[optionSettingBoxIndex] : ", document.querySelectorAll('.option-setting-box')[optionSettingBoxIndex]);

            console.log("DBG_option-title : ", document.querySelectorAll('.option-setting-box')[optionSettingBoxIndex].querySelectorAll('.option-text'));
            console.log("DBG_option-title[0] : ", document.querySelectorAll('.option-setting-box')[optionSettingBoxIndex].querySelectorAll('.option-text')[0]);

            console.log("DBG7_option-setting-box : ", document.querySelectorAll('.option-setting-box')[optionSettingBoxIndex].querySelectorAll('.option-text'));
            let eachSmallOptions = document.querySelectorAll('.option-setting-box')[optionSettingBoxIndex].querySelectorAll('.option-text');
            eachSmallOptions
            console.log("eachSmallOptions : ", eachSmallOptions);
            eachSmallOptions.forEach((p, eachSmallOptionIndex) => {
                console.log("eachSmallOptionIndex : ", eachSmallOptionIndex);
                console.log("eachSmallOptions[eachSmallOptionIndex].innerText : ", eachSmallOptions[eachSmallOptionIndex].innerText);
                /// オプション名（大項目）例；「サイズ」
                if (eachSmallOptionIndex == 0) {
                    optionTitle = eachSmallOptions[eachSmallOptionIndex].innerText
                }
                /// それぞれのオプション名（小ｊ項目）例；「小盛り、普通」
                else {
                    eachSmallOptions[eachSmallOptionIndex].innerText
                    console.log("■ーーーDBG8");
                    if (eachSmallOptionIndex == 1) {
                        // sizeStr = sizeStr + optionTitle;
                        generalOptionStr = generalOptionStr + `<div class="inner-box-option-title-div" >ーーー<span class="inner-box-option-title">${optionTitle}</span>`;
                        generalOptionShowStr = generalOptionShowStr + `<div class="inner-box-option-title-div-show" >ーーー<span class="inner-box-option-title">${optionTitle}</span>`;
                    }


                    /// -> サイズ、辛さ、硬さ・・・のレイヤーで回る（この場合要素（ループ）は３つ）
                    generalOptionStr = generalOptionStr +
                        `
                    <div class="general-option-front-one-set">
                        <label class="">
                            <input type="checkbox" class="general-option-check hidden-org-checkbox" disabled="disabled" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-option">${eachSmallOptions[eachSmallOptionIndex].innerText}</span>
                        </label>
                        <label class="">
                            <input type="checkbox" class="general-option-recommend-check hidden-org-checkbox" disabled="disabled" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-option-reccomend">おすすめ！</span>
                        </label>
                    </div>
                    `;

                    generalOptionShowStr = generalOptionShowStr +
                        `
                    <div class="general-option-front-one-set">
                        <label class="">
                            <input type="checkbox" class="general-option-check-show hidden-org-checkbox" disabled="disabled" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-option">${eachSmallOptions[eachSmallOptionIndex].innerText}</span>
                        </label>
                        <label class="">
                            <input type="checkbox" class="general-option-recommend-check-show hidden-org-checkbox" disabled="disabled" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-option-reccomend">おすすめ！</span>
                        </label>
                    </div>
                    `;

                    /// 最後に</div>を追加
                    /// TODO : DOM操作に変更する
                    if (eachSmallOptionIndex + 1 == eachSmallOptions.length) {
                        generalOptionStr = generalOptionStr + `</div>`;
                        generalOptionShowStr = generalOptionShowStr + `</div>`;
                    }

                    console.log("generalOptionStr : ", generalOptionStr);
                }
            });
            /// １つのオプションが終わったらフロントのボックスに入れる項目を一つ作成
            // generalOptionStr = "DBGDBGDBG"
            console.log("generalOptionStr : ", generalOptionStr);
            /// ここがフロントのメニューBOXのトッピングのチェックなどを表示させる場所
            /// フロント側ボックス全てに先ほど作成した同じ文字列（HTML）を挿入
            document.querySelectorAll('.general-option').forEach((p, index) => {
                console.log('DBG2_p:' + p + '、DBG2_index:' + $(index).text());
                // document.querySelectorAll('.general-option-title')[index].innerHTML = optionTitle;
                document.querySelectorAll('.general-option')[index].innerHTML = generalOptionStr;
                document.querySelectorAll('.general-option-all-show')[index].innerHTML = generalOptionShowStr;
            });
        });
    }

    ///追加されたボックスのトッピングの欄を更新
    function addToppingOption() {
        // console.log("addToppingOption");

        ///ここで現在選択中のタブ番号を取得できればOK
        // console.log("現在選択中のタブ番号を取得できればOK");
        // console.log("this : ", this);
        ///アクティブのタブは一つしかないはずなので[0]
        let activeTabElement = document.getElementsByClassName('ui-state-active')[0];
        // console.log("activeTabElement : ", activeTabElement);
        // console.log("activeTabElement.id : ", activeTabElement.id);
        // console.log("activeTabElement.innerText : ", activeTabElement.innerText);

        let currentShapeshiftId = "shapeshift_" + activeTabElement.id;
        let currentShapeshiftElement = document.getElementById(currentShapeshiftId);
        // console.log("currentShapeshiftElement.querySelectorAll('.menu-divs') : " , currentShapeshiftElement.querySelectorAll('.menu-divs'));
        // console.log("currentShapeshiftElement.querySelectorAll('.menu-divs').length : " , currentShapeshiftElement.querySelectorAll('.menu-divs').length);

        let menuDivsNumInCurrentTab = currentShapeshiftElement.querySelectorAll('.menu-divs').length;
        // console.log("menuDivsNumInCurrentTab : " , menuDivsNumInCurrentTab);
        // console.log("currentShapeshiftElement.querySelectorAll('.topping') : " , currentShapeshiftElement.querySelectorAll('.topping'));

        ///ボックスないのトッピングの文字
        let toppingStr = "";
        ///ポップアップウィンドウへ入れる文字
        let toppingShowStr = "";

        /// 追加ボタンで追加した時
        ///トッピングテーブルを更新
        // $("#form-topping-option").empty();
        $(".topping-item").each(function (i, o) {
            console.log('addToppingOption()内インデックス番号:' + i + '、テキスト:' + $(o).text());
            toppingStr = toppingStr +
                `
            <div class="topping-front-one-set">
                <label class="">
                    <input type="checkbox" class="topping-check hidden-org-checkbox" disabled="disabled" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-topping">${$(o).text()}</span>
                </label>
                <label class="">
                    <input type="checkbox" class="topping-recommend-check hidden-org-checkbox" disabled="disabled" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-topping-reccomend">おすすめ！</span>
                </label>
            </div>
            `;

            toppingShowStr = toppingShowStr +
                `
            <div class="topping-front-one-set">
                <label class="">
                    <input type="checkbox" class="topping-check-show hidden-org-checkbox" disabled="disabled" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-topping">${$(o).text()}</span>
                </label>
                <label class="">
                    <input type="checkbox" class="topping-recommend-check-show hidden-org-checkbox" disabled="disabled" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-topping-reccomend">おすすめ！</span>
                </label>
            </div>
            `;
        });

        currentShapeshiftElement.querySelectorAll('.topping')[menuDivsNumInCurrentTab - 1].innerHTML = toppingStr;
        currentShapeshiftElement.querySelectorAll('.topping-all-show')[menuDivsNumInCurrentTab - 1].innerHTML = toppingShowStr;
    }

    ///追加されたボックスの汎用オプションの欄を更新
    function addgeneralOption() {
        ///ここで現在選択中のタブ番号を取得できればOK
        // console.log("現在選択中のタブ番号を取得できればOK");
        // console.log("this : ", this);
        ///アクティブのタブは一つしかないはずなので[0]
        let activeTabElement = document.getElementsByClassName('ui-state-active')[0];
        // console.log("activeTabElement : ", activeTabElement);
        // console.log("activeTabElement.id : ", activeTabElement.id);
        // console.log("activeTabElement.innerText : ", activeTabElement.innerText);

        let currentShapeshiftId = "shapeshift_" + activeTabElement.id;
        let currentShapeshiftElement = document.getElementById(currentShapeshiftId);
        // console.log("currentShapeshiftElement.querySelectorAll('.menu-divs') : " , currentShapeshiftElement.querySelectorAll('.menu-divs'));
        // console.log("currentShapeshiftElement.querySelectorAll('.menu-divs').length : " , currentShapeshiftElement.querySelectorAll('.menu-divs').length);

        let menuDivsNumInCurrentTab = currentShapeshiftElement.querySelectorAll('.menu-divs').length;
        // console.log("menuDivsNumInCurrentTab : " , menuDivsNumInCurrentTab);
        // console.log("currentShapeshiftElement.querySelectorAll('.topping') : " , currentShapeshiftElement.querySelectorAll('.topping'));

        ///ボックスないのトッピングの文字
        let generalOptionStr = "";
        ///ポップアップウィンドウへ入れる文字
        let generalOptionShowStr = "";

        /// -> サイズ、辛さ、硬さ、などの大項目のリスト
        document.querySelectorAll('.option-setting-box').forEach((p, optionSettingBoxIndex) => {
            console.log("optionSettingBoxIndex : ", optionSettingBoxIndex);
            console.log("document.querySelectorAll('.option-setting-box')[optionSettingBoxIndex] : ", document.querySelectorAll('.option-setting-box')[optionSettingBoxIndex]);

            console.log("DBG_option-title : ", document.querySelectorAll('.option-setting-box')[optionSettingBoxIndex].querySelectorAll('.option-text'));
            console.log("DBG_option-title[0] : ", document.querySelectorAll('.option-setting-box')[optionSettingBoxIndex].querySelectorAll('.option-text')[0]);

            console.log("DBG7_option-setting-box : ", document.querySelectorAll('.option-setting-box')[optionSettingBoxIndex].querySelectorAll('.option-text'));
            let eachSmallOptions = document.querySelectorAll('.option-setting-box')[optionSettingBoxIndex].querySelectorAll('.option-text');
            eachSmallOptions
            console.log("eachSmallOptions : ", eachSmallOptions);
            eachSmallOptions.forEach((p, eachSmallOptionIndex) => {
                console.log("eachSmallOptionIndex : ", eachSmallOptionIndex);
                console.log("eachSmallOptions[eachSmallOptionIndex].innerText : ", eachSmallOptions[eachSmallOptionIndex].innerText);
                /// オプション名（大項目）例；「サイズ」
                if (eachSmallOptionIndex == 0) {
                    optionTitle = eachSmallOptions[eachSmallOptionIndex].innerText
                }
                /// それぞれのオプション名（小ｊ項目）例；「小盛り、普通」
                else {
                    eachSmallOptions[eachSmallOptionIndex].innerText
                    console.log("■ーーーDBG8");
                    if (eachSmallOptionIndex == 1) {
                        // sizeStr = sizeStr + optionTitle;
                        generalOptionStr = generalOptionStr + `<div class="inner-box-option-title-div" >ーーー<span class="inner-box-option-title">${optionTitle}</span>`;
                        generalOptionShowStr = generalOptionShowStr + `<div class="inner-box-option-title-div-show" >ーーー<span class="inner-box-option-title">${optionTitle}</span>`;
                    }

                    /// -> サイズ、辛さ、硬さ・・・のレイヤーで回る（この場合要素（ループ）は３つ）
                    generalOptionStr = generalOptionStr +
                        `
                    <div class="general-option-front-one-set">
                        <label class="">
                            <input type="checkbox" class="general-option-check hidden-org-checkbox" disabled="disabled" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-option">${eachSmallOptions[eachSmallOptionIndex].innerText}</span>
                        </label>
                        <label class="">
                            <input type="checkbox" class="general-option-recommend-check hidden-org-checkbox" disabled="disabled" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-option-reccomend">おすすめ！</span>
                        </label>
                    </div>
                    `;

                    generalOptionShowStr = generalOptionShowStr +
                        `
                    <div class="general-option-front-one-set">
                        <label class="">
                            <input type="checkbox" class="general-option-check-show hidden-org-checkbox" disabled="disabled" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-option">${eachSmallOptions[eachSmallOptionIndex].innerText}</span>
                        </label>
                        <label class="">
                            <input type="checkbox" class="general-option-recommend-check-show hidden-org-checkbox" disabled="disabled" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-option-reccomend">おすすめ！</span>
                        </label>
                    </div>
                    `;

                    /// 最後に</div>を追加
                    /// TODO : DOM操作に変更する
                    if (eachSmallOptionIndex + 1 == eachSmallOptions.length) {
                        generalOptionStr = generalOptionStr + `</div>`;
                        generalOptionShowStr = generalOptionShowStr + `</div>`;
                    }

                    console.log("generalOptionStr : ", generalOptionStr);
                }
            });
            /// １つのオプションが終わったらフロントのボックスに入れる項目を一つ作成
            // generalOptionStr = "DBGDBGDBG"
            console.log("generalOptionStr : ", generalOptionStr);
            /// ここがフロントのメニューBOXのトッピングのチェックなどを表示させる場所
            /// フロント側ボックス全てに先ほど作成した同じ文字列（HTML）を挿入
            // document.querySelectorAll('.general-option').forEach((p, index) => {
            // console.log('DBG2_p:' + p + '、DBG2_index:' + $(index).text());
            // document.querySelectorAll('.general-option-title')[index].innerHTML = optionTitle;
            document.querySelectorAll('.general-option')[menuDivsNumInCurrentTab - 1].innerHTML = generalOptionStr;
            document.querySelectorAll('.general-option-all-show')[menuDivsNumInCurrentTab - 1].innerHTML = generalOptionShowStr;
            // });
        });
    }


    function updateMenuOptionAction() {
        console.log(`DBG13_updateMenuOptionAction`);

        document.querySelectorAll('.menu-option').forEach((p, index) => {
            /// Cropperに関する処理
            document.getElementsByClassName('is-show-img')[index].onclick = function () {
                console.log(`${index}番目の is-show-img clicked`);
                let clicked_index = $('.is-show-img').index(this);
                console.log(`is-show-img clicked_index : `, clicked_index);

                console.log("is-show-checked : ", document.querySelectorAll('.is-show-check')[clicked_index].checked);
                let isShow = document.querySelectorAll('.is-show-check')[clicked_index].checked;
                if (isShow) {
                    document.querySelectorAll('.menu-divs')[clicked_index].classList.add("not-shown");
                    document.querySelectorAll('.is-show-img')[clicked_index].src = "images/hide.png";
                    document.querySelectorAll('.is-show-check')[clicked_index].checked = false;
                }
                else {
                    /// 表示設定にする
                    document.querySelectorAll('.menu-divs')[clicked_index].classList.remove("not-shown");
                    document.querySelectorAll('.is-show-img')[clicked_index].src = "images/show.png";
                    document.querySelectorAll('.is-show-check')[clicked_index].checked = true;
                }

                // /// ローディングを表示
                // setLoadingStatus('');
                // ///クリックされたボックスのインデックス（タブの入れ替えはHTMLコード内では実際に順番は変わっていないため、この値はタブの入れ替えによらず、HTMLコードの順番通りの数字がつくので、結果的に帳尻が合う）
                // let clicked_index = $('.image-crop').index(this);
                // // alert(clicked_index);
                // /// こちらがHTML通りの順番（タブ入れ替え後の最新版の順番）
                // console.log("clicked_index : ", clicked_index);
                // currentCropClickedIndex = clicked_index;
                // console.log("image-cropリック")
                // console.log(`Cropper_開いたindex : ${index}`);

                // // cropper.replace(document.querySelectorAll('.menu-items')[currentCropClickedIndex].src);
                // cropper.replace(document.querySelectorAll('.org-menu-image')[currentCropClickedIndex].src);
                // console.log(`DBG_1`);

                // // imageCropModalElement.style.display = "block";
                // imageCropModalElement.style.visibility = "visible";
                // console.log(`DBG_2`);
            }

            /// Cropperに関する処理
            document.getElementsByClassName('image-crop')[index].onclick = function () {
                // /// ローディングを表示
                // setLoadingStatus('');
                ///クリックされたボックスのインデックス（タブの入れ替えはHTMLコード内では実際に順番は変わっていないため、この値はタブの入れ替えによらず、HTMLコードの順番通りの数字がつくので、結果的に帳尻が合う）
                let clicked_index = $('.image-crop').index(this);
                // alert(clicked_index);
                /// こちらがHTML通りの順番（タブ入れ替え後の最新版の順番）
                console.log("clicked_index : ", clicked_index);
                currentCropClickedIndex = clicked_index;
                console.log("image-cropリック")
                console.log(`Cropper_開いたindex : ${index}`);

                // var cropperImg = document.getElementById('cropper-img');
                // console.log(`画像のsrc : ${document.querySelectorAll('.menu-items')[clicked_index].src}`);
                // document.getElementById('cropper-img').src = document.querySelectorAll('.menu-items')[clicked_index].src;

                /// if
                /// モーダルを開くたびにここで画像を今回対象の画像へ入れ替える
                // cropper.replace(document.querySelectorAll('.menu-items')[currentCropClickedIndex].src);
                cropper.replace(document.querySelectorAll('.org-menu-image')[currentCropClickedIndex].src);
                console.log(`DBG_1`);

                // const cropper = new Cropper(cropperImg, {
                //     // aspectRatio: 16 / 9,
                //     aspectRatio: 1 / 1,
                //     viewMode: 1,
                //     preview: '.crop-preview-img',
                //     minCropBoxWidth: 100,
                //     minCropBoxHeight: 100,
                //     toggleDragModeOnDblclick: false,
                //     dragMode: "move",
                //     crop(event) {
                //         console.log(event.detail.x);
                //         console.log(event.detail.y);
                //         console.log(event.detail.width);
                //         console.log(event.detail.height);
                //         console.log(event.detail.rotate);
                //         console.log(event.detail.scaleX);
                //         console.log(event.detail.scaleY);
                //     },
                // });
                // imageCropModalElement.style.display = "block";
                imageCropModalElement.style.visibility = "visible";
                console.log(`DBG_2`);

                // console.log("document.querySelectorAll('.crop-top')[currentCropClickedIndex].innerText : ", document.querySelectorAll('.crop-top')[currentCropClickedIndex].innerText);



                console.log("left : ", document.querySelectorAll('.crop-left')[currentCropClickedIndex].dataset.left);
                console.log("top : ", document.querySelectorAll('.crop-top')[currentCropClickedIndex].dataset.top);
                console.log("width : ", document.querySelectorAll('.crop-width')[currentCropClickedIndex].dataset.width);
                console.log("height : ", document.querySelectorAll('.crop-height')[currentCropClickedIndex].dataset.height);

                ///---Crop領域を取得＆設定
                // cropLeft = 0.16666666666668561;
                // cropTop = 0;
                // cropWidth = 312.5333333333333;
                // cropHeight = 175.8;
                cropLeft = Number(document.querySelectorAll('.crop-left')[currentCropClickedIndex].dataset.left);
                cropTop = Number(document.querySelectorAll('.crop-top')[currentCropClickedIndex].dataset.top);
                cropWidth = Number(document.querySelectorAll('.crop-width')[currentCropClickedIndex].dataset.width);
                cropHeight = Number(document.querySelectorAll('.crop-height')[currentCropClickedIndex].dataset.height);
            }

            /// Cropperに関する処理
            ///===各情報の編集ボタンを押した後の処理、モーダルウィンドウが開くところから
            document.getElementsByClassName('menu-option')[index].onclick = function () {
                console.log("menu-optionクリック")
                console.log(`開いたindex : ${index}`);

                // $('#modalArea').fadeIn();
                modalAreaElement.style.display = "block";
                // let topping_option = document.getElementById("form-topping-option")
                // $("#form-topping-option").append(
                //     `DBG`
                // );

                // $("#form-topping-option").empty();

                ///クリックされたボックスのインデックス（タブの入れ替えはHTMLコード内では実際に順番は変わっていないため、この値はタブの入れ替えによらず、HTMLコードの順番通りの数字がつくので、結果的に帳尻が合う）
                let clicked_index = $('.menu-option').index(this);
                // alert(clicked_index);

                /// こちらがHTML通りの順番（タブ入れ替え後の最新版の順番）
                console.log("clicked_index : ", clicked_index);

                currentIndex = clicked_index;

                // document.querySelectorAll('.menu-divs').forEach((p, index) => {
                // console.log(`p : ${p}`);
                // console.log(`index : ${index}`);

                ///===各ボックスパーツの値をフォームの各値へコピー
                ///価格
                // console.log(document.querySelectorAll('.item-value')[clicked_index].textContent);
                formPriceElement.value = document.querySelectorAll('.item-value')[clicked_index].textContent;
                ///商品名
                formNameElement.value = document.querySelectorAll('.item-name')[clicked_index].textContent;
                ///商品説明
                formItemDescriptionElement.value = document.querySelectorAll('.item-description')[clicked_index].textContent;
                ///原材料
                formItemIngredientsElement.value = document.querySelectorAll('.ingredients')[clicked_index].textContent;
                ///アレルギー
                // formItemAllergyElement.value = document.querySelectorAll('.allergy')[clicked_index].textContent;
                ///アレルゲン
                ///１ボックス内の全てのチェックボックスの情報をtoppingCheckBoxesへ格納
                let allergenCheckBoxes = document.querySelectorAll('.allergen')[clicked_index].querySelectorAll('.allergen-check');
                ///１ボックス内の全てのアレルゲン名の情報をtoppingListsへ格納
                let allergenLists = document.querySelectorAll('.allergen')[clicked_index].querySelectorAll('.inner-box-allergen');
                ///表示するリストを一度リセット
                $("#allergen-option").empty();
                ///リストへ挿入する用の文字列変数を用意
                let addAllergenStr = "";
                ///ボックス内のアレルゲン情報をモーダル内フォームへ反映
                for (i = 0; i < allergenCheckBoxes.length; i++) {
                    console.log("allergenCheckBoxes[i].checked : ", allergenCheckBoxes[i].checked);
                    console.log("allergenLists[i].innerText : ", allergenLists[i].innerText);

                    ///各項目のチェック状態に応じてチェック/Notを変更
                    if (allergenCheckBoxes[i].checked) {
                        addAllergenStr = `
                            <label class="btn" style="display: flex;">
                                <input class="form-allergen-check" type="checkbox" checked name=''><i class="fa fa-square-o fa-2x"></i><i class="fa fa-check-square-o fa-2x"></i><span class="added-allergens">${allergenLists[i].innerText}</span>
                            </label>
                        `
                    } else {
                        addAllergenStr = `
                        <label class="btn" style="display: flex;">
                            <input class="form-allergen-check" type="checkbox" name=''><i class="fa fa-square-o fa-2x"></i><i class="fa fa-check-square-o fa-2x"></i><span class="added-allergens">${allergenLists[i].innerText}</span>
                        </label>
                        `
                    }
                    ///フォーム内のアレルゲンリストへ追加
                    $("#allergen-option").append(addAllergenStr);
                }

                // ///辛さの選択
                // console.log("DBG_11_document.querySelectorAll('.spiciness')[clicked_index] : ", document.querySelectorAll('.spiciness')[clicked_index]);
                // let spicinessRadioSelected = document.querySelectorAll('.spiciness')[clicked_index];
                // console.log("spicinessRadioSelected.innerText : ", spicinessRadioSelected.innerText);
                // /// ボックスの辛さ選択の文字に応じてラジオボタンを更新
                // if (spicinessRadioSelected.innerText == "No") {
                //     formItemSpicinessElement[1].checked = true;
                // }
                // else {
                //     formItemSpicinessElement[0].checked = true;
                // }
                // ///量の選択
                // console.log("DBG_12_document.querySelectorAll('.amount')[clicked_index] : ", document.querySelectorAll('.amount')[clicked_index]);
                // let amountRadioSelected = document.querySelectorAll('.amount')[clicked_index];
                // console.log("amountRadioSelected.innerText : ", amountRadioSelected.innerText);
                // /// ボックスの量のの文字に応じてラジオボタンを更新
                // if (amountRadioSelected.innerText == "No") {
                //     formItemAmountElement[1].checked = true;
                // }
                // else {
                //     formItemAmountElement[0].checked = true;
                // }

                ///===トッピング
                ///１ボックス内のトッピング自体のチェックボックスの全ての情報をtoppingCheckBoxesへ格納
                let toppingCheckBoxes = document.querySelectorAll('.topping')[clicked_index].querySelectorAll('.topping-check');
                ///１ボックス内のトッピングのおすすめのチェックボックス全ての情報をtoppingCheckBoxesへ格納
                let toppingRecommendCheckBoxes = document.querySelectorAll('.topping')[clicked_index].querySelectorAll('.topping-recommend-check');
                /// １ボックス内の全てのトッピング名の情報をtoppingListsへ格納
                /// トッピング名のボックスのリスト。toppingLists[i].innerTextでトッピング名を取得できる
                let toppingLists = document.querySelectorAll('.topping')[clicked_index].querySelectorAll('.inner-box-topping');
                /// 「おすすめ！」という文字列に対するリスト。なので、全て文言が同じであれば同じ（おすすめ！という文言固定のうちは使わない）
                // let toppingRecommendTextLists = document.querySelectorAll('.topping')[clicked_index].querySelectorAll('.inner-box-topping-reccomend');
                // console.log("toppingCheckBoxes.length : ", toppingCheckBoxes.length);

                ///表示するリストを一度リセット
                $("#form-topping-option").empty();
                ///リストへ挿入する用の文字列変数を用意
                let addToppingStr = "";

                /// トッピングのチェック/notによって入れるHTMLのテキストを変える
                let = toppingCheckStr = "";
                /// トッピングのおすすめのチェック/notによって入れるHTMLのテキストを変える
                let = toppingRecommendCheckStr = "";

                console.log("■DBG1_toppingLists : ", toppingLists);
                ///->
                /// チーズ, おすすめ

                ///ボックス内のトッピング情報をモーダル内フォームへ反映
                for (i = 0; i < toppingCheckBoxes.length; i++) {
                    // console.log("toppingCheckBoxes : ", toppingCheckBoxes);
                    // console.log("toppingCheckBoxes[i] : ", toppingCheckBoxes[i]);
                    console.log("toppingCheckBoxes[i].checked : ", toppingCheckBoxes[i].checked);
                    // console.log("toppingLists[i] : ", toppingLists[i]);
                    console.log("toppingLists[i].innerText : ", toppingLists[i].innerText);

                    /// トッピング自体のチェックボックスに対してT/Fで分岐
                    if (toppingCheckBoxes[i].checked) {
                        toppingCheckStr = `
                        <label class="btn topping-unit" style="display: flex;">
                            <input class="form-topping-check hidden-org-checkbox" type="checkbox" checked name=''><i class="fa fa-square-o fa-2x"></i><i class="fa fa-check-square-o fa-2x"></i><span class="added-toppings">${toppingLists[i].innerText}</span>
                        </label>
                        `
                    } else {
                        toppingCheckStr = `
                        <label class="btn topping-unit" style="display: flex;">
                            <input class="form-topping-check hidden-org-checkbox" type="checkbox" name=''><i class="fa fa-square-o fa-2x"></i><i class="fa fa-check-square-o fa-2x"></i><span class="added-toppings">${toppingLists[i].innerText}</span>
                        </label>
                        `
                    }

                    /// おすすめのチェックボックスに対して
                    if (toppingRecommendCheckBoxes[i].checked) {
                        toppingRecommendCheckStr = `
                        <label class="btn topping-unit" style="display: flex;">
                            <input class="form-topping-recommend-check hidden-org-checkbox" type="checkbox" checked name=''><i class="fa fa-square-o fa-2x"></i><i class="fa fa-check-square-o fa-2x"></i><span class="added-toppings">おすすめ！</span>
                        </label>
                        `
                    } else {
                        toppingRecommendCheckStr = `
                        <label class="btn topping-unit" style="display: flex;">
                            <input class="form-topping-recommend-check hidden-org-checkbox" type="checkbox" name=''><i class="fa fa-square-o fa-2x"></i><i class="fa fa-check-square-o fa-2x"></i><span class="added-toppings">おすすめ！</span>
                        </label>
                        `
                    }

                    ///モーダル内フォームへ各項目のチェック状態に応じてチェック/Notを適応させて入れる
                    addToppingStr = `
                    <div class="topping-one-set">
                        ${toppingCheckStr}
                        ${toppingRecommendCheckStr}
                    </div>
                    `
                    // if (toppingCheckBoxes[i].checked) {
                    //     addToppingStr = `
                    //                     <div class="topping-one-set">
                    //                         ${toppingCheckStr}
                    //                         ${toppingRecommendCheckStr}
                    //                     </div>
                    //                     `
                    // }
                    // else {
                    //     addToppingStr = `
                    //                     <div class="topping-one-set">
                    //                         ${toppingCheckStr}
                    //                         ${toppingRecommendCheckStr}
                    //                     </div>
                    //                     `
                    // }
                    ///フォーム内のトッピング可能なリストへ追加
                    $("#form-topping-option").append(addToppingStr);
                }


                ///===トッピング以外の汎用オプションについて
                // console.log("food-sale-price-value : " , document.querySelectorAll('.food-sale-price-value')[clicked_index].textContent);
                // console.log("food-sale-price-check : " , document.querySelectorAll('.food-sale-price-check')[clicked_index].checked);
                ///１ボックス内のトッピング自体のチェックボックスの全ての情報をtoppingCheckBoxesへ格納
                let generalOptionTitles = document.querySelectorAll('.general-option')[clicked_index].querySelectorAll('.inner-box-option-title-div');
                let generalOptionCheckBoxes = document.querySelectorAll('.general-option')[clicked_index].querySelectorAll('.general-option-check');
                // let generalOptionCheckBoxes = document.querySelectorAll('.general-option')[clicked_index];
                ///１ボックス内のトッピングのおすすめのチェックボックス全ての情報をgeneralOptionCheckBoxesへ格納
                let generalOptionRecommendCheckBoxes = document.querySelectorAll('.general-option')[clicked_index].querySelectorAll('.general-option-recommend-check');
                /// １ボックス内の全てのトッピング名の情報をoptionListsへ格納
                /// オプション名のボックスのリスト。optionLists[i].innerTextでトッピング名を取得できる
                let optionLists = document.querySelectorAll('.general-option')[clicked_index].querySelectorAll('.inner-box-option');
                /// 「おすすめ！」という文字列に対するリスト。なので、全て文言が同じであれば同じ（おすすめ！という文言固定のうちは使わない）
                // let optionRecommendTextLists = document.querySelectorAll('.option')[clicked_index].querySelectorAll('.inner-box-option-reccomend');
                // console.log("generalOptionCheckBoxes.length : ", generalOptionCheckBoxes.length);

                console.log("generalOptionCheckBoxes : ", generalOptionCheckBoxes);
                console.log("generalOptionRecommendCheckBoxes : ", generalOptionRecommendCheckBoxes);
                console.log("optionLists : ", optionLists);

                // return;

                ///表示するリストを一度リセット
                $("#form-general-option").empty();

                ///リストへ挿入する用の文字列変数を用意
                let addGeneralOptionStr = "";

                /// トッピングのチェック/notによって入れるHTMLのテキストを変える
                let = generalOptionCheckStr = "";
                /// トッピングのおすすめのチェック/notによって入れるHTMLのテキストを変える
                let = generalOptionRecommendCheckStr = "";

                console.log("■DBG1_optionLists : ", optionLists);
                ///->
                /// チーズ, おすすめ

                console.log("generalOptionTitles : ", generalOptionTitles);
                console.log("generalOptionCheckBoxes : ", generalOptionCheckBoxes);

                ///ボックス内のトッピング情報をモーダル内フォームへ反映
                // for ( i = 0; i < generalOptionCheckBoxes.length; i++) {
                for (i = 0; i < generalOptionTitles.length; i++) {
                    /// 例：サイズに関してのループ
                    console.log("generalOptionTitles[i] : ", generalOptionTitles[i]);
                    console.log("DBG_generalOptionTitles[i].querySelector(.inner-box-option-title).innerText : ", generalOptionTitles[i].querySelector(".inner-box-option-title").innerText);
                    let bigOptionName = generalOptionTitles[i].querySelector(".inner-box-option-title").innerText;
                    // console.log("generalOptionTitles[i].querySelector(.inner-box-option-title) : ", generalOptionTitles[i].querySelector(".inner-box-option-title"));
                    // /// -> サイズ、からさ、硬さ
                    // console.log("generalOptionTitles[i].querySelector('.general-option-front-one-set') : ", generalOptionTitles[i].querySelectorAll(".general-option-front-one-set"));
                    /// -> やわらかめ　おすすめ
                    // console.log("generalOptionTitles[i].querySelector(.inner-box-option-title).querySelectorAll(.general-option-front-one-set) : ", generalOptionTitles[i].querySelector(".inner-box-option-title").querySelectorAll('.general-option-front-one-set'));
                    // console.log("generalOptionTitles[i].querySelectorAll('.general-option-front-one-set') : ", generalOptionTitles[i].querySelectorAll('.general-option-front-one-set'));

                    let innerEachBigOption = generalOptionTitles[i].querySelectorAll(".general-option-front-one-set");
                    console.log(`${i}_DBG_innerEachBigOption : `, innerEachBigOption);
                    innerEachBigOption.forEach((p, index) => {
                        console.log("innerEachBigOption[index] : ", innerEachBigOption[index]);
                        // console.log("innerEachBigOption[index].querySelector(`.inner-box-option-title`]) : " , innerEachBigOption[index].querySelector(`.inner-box-option-title`));
                        console.log("innerEachBigOption[index].querySelector(`.inner-box-option`].innerText) : ", innerEachBigOption[index].querySelector(`.inner-box-option`).innerText);
                        console.log("innerEachBigOption[index].querySelector(`.general-option-check`].checked) : ", innerEachBigOption[index].querySelector(`.general-option-check`).checked);
                        console.log("innerEachBigOption[index].querySelector(`.inner-box-option-reccomend`].innerText) : ", innerEachBigOption[index].querySelector(`.inner-box-option-reccomend`).innerText);
                        console.log("innerEachBigOption[index].querySelector(`.general-option-check`].checked) : ", innerEachBigOption[index].querySelector(`.general-option-check`).checked);

                        let smallOptionName = innerEachBigOption[index].querySelector(`.inner-box-option`).innerText;
                        let smallOptionNameCheck = innerEachBigOption[index].querySelector(`.general-option-check`).checked;
                        let smallOptionRecommendName = innerEachBigOption[index].querySelector(`.inner-box-option-reccomend`).innerText;
                        let smallOptionRecommendNameCheck = innerEachBigOption[index].querySelector(`.general-option-recommend-check`).checked;

                        console.log("DBG_100_generalOptionCheckBoxes : ", generalOptionCheckBoxes);
                        // console.log("DBG_100_generalOptionCheckBoxes.checkd : " , generalOptionCheckBoxes[addCount + index].checked);
                        console.log("DBG_100_smallOptionName : ", smallOptionName);

                        /// トッピング自体のチェックボックスに対してT/Fで分岐
                        // if (generalOptionCheckBoxes[addCount + index].checked) {
                        if (smallOptionNameCheck) {
                            generalOptionCheckStr = `
                            <label class="btn option-unit" style="display: flex;">
                                <input class="form-option-check hidden-org-checkbox" type="checkbox" checked name=''><i class="fa fa-square-o fa-2x"></i><i class="fa fa-check-square-o fa-2x"></i><span class="added-options">${smallOptionName}</span>
                            </label>
                            `
                        } else {
                            generalOptionCheckStr = `
                            <label class="btn option-unit" style="display: flex;">
                                <input class="form-option-check hidden-org-checkbox" type="checkbox" name=''><i class="fa fa-square-o fa-2x"></i><i class="fa fa-check-square-o fa-2x"></i><span class="added-options">${smallOptionName}</span>
                            </label>
                            `
                        }

                        /// おすすめのチェックボックスに対して
                        // if (generalOptionRecommendCheckBoxes[addCount + index].checked) {
                        if (smallOptionRecommendNameCheck) {
                            generalOptionRecommendCheckStr = `
                            <label class="btn option-unit" style="display: flex;">
                                <input class="form-option-recommend-check hidden-org-checkbox" type="checkbox" checked name=''><i class="fa fa-square-o fa-2x"></i><i class="fa fa-check-square-o fa-2x"></i><span class="added-options">おすすめ！</span>
                            </label>
                            `
                        } else {
                            generalOptionRecommendCheckStr = `
                            <label class="btn option-unit" style="display: flex;">
                                <input class="form-option-recommend-check hidden-org-checkbox" type="checkbox" name=''><i class="fa fa-square-o fa-2x"></i><i class="fa fa-check-square-o fa-2x"></i><span class="added-options">おすすめ！</span>
                            </label>
                            `
                        }

                        ///モーダル内フォームへ各項目のチェック状態に応じてチェック/Notを適応させて入れる
                        addGeneralOptionStr = `
                        <div class="general-option-one-set">
                            ${generalOptionCheckStr}
                            ${generalOptionRecommendCheckStr}
                        </div>
                        `

                        /// 初めだけ先頭にタイトルを追加
                        if (index == 0) {
                            addGeneralOptionStr = `<div class="form-option-title">${bigOptionName}</div>` + addGeneralOptionStr;
                        }

                        ///フォーム内のトッピング可能なリストへ追加
                        $("#form-general-option").append(addGeneralOptionStr);
                    });

                    // addCount++;
                }


                // return;

                console.log("document.querySelectorAll('.food-sale-price-value')[clicked_index] : ", document.querySelectorAll('.food-sale-price-value')[clicked_index]);
                console.log("DBG_clicked_index : ", clicked_index);
                /// セール価格
                formSalsePriceElement.value = document.querySelectorAll('.food-sale-price-value')[clicked_index].textContent;
                /// セール価格適用チェック
                formSalsePriceCheckElement.checked = document.querySelectorAll('.food-sale-price-check')[clicked_index].checked;
                /// ご飯が含まれるかチェック
                formContainRiceCheckElement.checked = document.querySelectorAll('.contain-rice-check')[clicked_index].checked;
                /// おすすめメニューチェック
                formRecommendedMenuCheckElement.checked = document.querySelectorAll('.recommended-menu-check')[clicked_index].checked;
                /// 内容量
                formContentsGramElement.value = document.querySelectorAll('.contents-gram-value')[clicked_index].textContent;

                /// 保存方法と消費期限のテキストを更新
                // formContentsGramElement.value = document.querySelectorAll('.contents-gram-value')[clicked_index].textContent;
                updatePreservationExpiration();

                // console.log("DBG_12_document.querySelectorAll('.topping')[clicked_index] : ", document.querySelectorAll('.topping')[clicked_index][""]);
                // console.log(document.querySelectorAll('input[class="topping-check"]'));
                // console.log(document.querySelectorAll('input[class="topping-check"]')[0].checked);
                // console.log(document.querySelectorAll('input[class="topping-check"]')[1].checked);


                // $("#parent").find('.child-image');
                // document.querySelectorAll('.menu-option').forEach((p, index) => {

                // formPriceElement.value = "700";
                // });

                // alert("モーダル")

                ///　保存方法
                console.log("DBG_22_clicked_index : ", clicked_index);
                // formNameElement.value = document.querySelectorAll('')[clicked_index].textContent;
                // console.log("DBG_22_!document.querySelectorAll('.preservation-num')[clicked_index] : " , !document.querySelectorAll('.preservation-num')[clicked_index]);


                // console.log("this.parent() : ", this.parent());
                /// shapeshift_xを取得
                // const DBG_parent = this.parentNode.parentNode;
                // const DBG_parentIdSelector = `#${DBG_parent.id}`;
                // // console.log("parent", parent);
                // console.log("DBG_parent.id", DBG_parent.id);


                console.log("All_preservation_num : ", document.querySelectorAll('.preservation-num'));
                // if (document.querySelectorAll('.preservation-num').length - 1 < clicked_index) {
                // if (document.querySelectorAll('.preservation-num')[clicked_index].textContent) {
                let preservationNum = document.querySelectorAll('.preservation-num')[clicked_index].textContent;
                console.log("クリックされたpreservationNum : ", preservationNum);

                if (preservationNum == "") {
                    console.log("DBG22_なしを選択");
                    // alert("BOXにはまだ保存先なし")
                    ///セレクトボックスを「選択なし」へ
                    formPreservationSelectboxElement.value = "";
                    // formPreservationSelectboxElement.value = "2";
                    ///下の表示メニューをそれぞれクリア
                    formPreservationElement.innerHTML = "";
                    formExpirationElement.innerHTML = "";
                } else {
                    if (preservationNum == 1) {
                        console.log("DBG22_1を選択");
                        formPreservationSelectboxElement.value = 1;

                        formPreservationElement.innerHTML = `<span id="form-preservation-num">1</span>.直射日光を避け涼しい所で保管し、期限内にお早めにお召し上がりください。`;
                        formExpirationElement.innerHTML = `<span></span><span>製造時刻から<span id="form-expiration-time">${3}</span>時間</span>`;

                    } else if (preservationNum == 2) {
                        console.log("DBG22_2を選択");
                        formPreservationSelectboxElement.value = 2;

                        formPreservationElement.innerHTML = `<span id="form-preservation-num">2</span>.冷蔵庫に保存して下さい。`;
                        formExpirationElement.innerHTML = `<span></span><span>製造時刻から<span id="form-expiration-time">${3 * 24}</span>時間（3日後）</span>`;
                    } else if (preservationNum == 3) {
                        console.log("3を選択");
                        formPreservationSelectboxElement.value = 3;

                        formPreservationElement.innerHTML = `<span id="form-preservation-num">3</span>.冷蔵庫に保存して下さい。`;
                        formExpirationElement.innerHTML = `<span></span><span>製造時刻から<span id="form-expiration-time">${21 * 24}</span>時間（21日後）</span>`;
                    }


                    // formPriceElement.value = document.querySelectorAll('.preservation-num')[clicked_index].textContent;

                    console.log("DBG_22_document.querySelectorAll('.preservation-num')[clicked_index].textContent : ", document.querySelectorAll('.preservation-num'));
                    console.log("DBG_22_document.querySelectorAll('.preservation-num') : ", document.querySelectorAll('.preservation-num')[clicked_index].textContent);
                }

                if (formPreservationSelectboxElement.value == 1) {
                    console.log("1を選択");
                    formPreservationElement.innerHTML = `<span id="form-preservation-num">1</span>.直射日光を避け涼しい所で保管し、期限内にお早めにお召し上がりください。`;
                    formExpirationElement.innerHTML = `<span></span><span>製造時刻から<span id="form-expiration-time">${3}</span>時間</span>`;
                } else if (formPreservationSelectboxElement.value == 2) {
                    console.log("2を選択");
                    formPreservationElement.innerHTML = `<span id="form-preservation-num">2</span>.冷蔵庫に保存して下さい。`;
                    formExpirationElement.innerHTML = `<span></span><span>製造時刻から<span id="form-expiration-time">${3 * 24}</span>時間（3日後）</span>`;
                } else if (formPreservationSelectboxElement.value == 3) {
                    console.log("3を選択");
                    formPreservationElement.innerHTML = `<span id="form-preservation-num">3</span>.冷蔵庫に保存して下さい。`;
                    formExpirationElement.innerHTML = `<span></span><span>製造時刻から<span id="form-expiration-time">${21 * 24}</span>時間（21日後）</span>`;
                }
                ///nullまたは空文字だったら
                else if (!formPreservationSelectboxElement.value) {
                    // alert("選択なし")
                    formPreservationElement.innerHTML = ``;
                    formExpirationElement.innerHTML = ``;
                }

            }

            // console.log("===");
            // console.log(document.querySelectorAll('input[class="food_img_file"]')[index].name);
            // document.querySelectorAll('input[class="food_img_file"]')[index].name = index + 1;
            // console.log("===");
        });

    }

    /// 各メニュー内のトッピングリストのうち、追加されたトッピングの項目のみを追加（この部分のみを削除することで、元々の設定値が変わらずに済む）
    function diffToppingAdd(addedToppingName) {
        console.log("diffToppingAdd");
        console.log("menu-divs", document.querySelectorAll('.menu-divs'));
        let meuDivs = document.querySelectorAll('.menu-divs');
        meuDivs.forEach((p, menuDivIndex) => {
            console.log("menuDivIndex : ", menuDivIndex);
            console.log("item-name : ", meuDivs[menuDivIndex].querySelector(".item-name").textContent);
            console.log("topping : ", meuDivs[menuDivIndex].querySelector(".topping"));
            let toppingArr = meuDivs[menuDivIndex].querySelector(".topping").querySelectorAll('.topping-front-one-set');
            console.log("toppingArr : ", toppingArr);
            console.log("meuDivs['menuDivIndex'] : ", meuDivs[menuDivIndex]);
            console.log("meuDivs['menuDivIndex'].getElementsByClassName('item-name') : ", meuDivs[menuDivIndex].getElementsByClassName('item-name'));

            let toppingStr = `
            <div class="topping-front-one-set">
                <label class="">
                    <input type="checkbox" class="topping-check hidden-org-checkbox" disabled="disabled" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-topping">${addedToppingName}</span>
                </label>
                <label class="">
                    <input type="checkbox" class="topping-recommend-check hidden-org-checkbox" disabled="disabled" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-topping-reccomend">おすすめ！</span>
                </label>
            </div>
            `;

            let toppingShowStr = `
            <div class="topping-front-one-set">
                <label class="">
                    <input type="checkbox" class="topping-check-show hidden-org-checkbox" disabled="disabled" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-topping">${addedToppingName}</span>
                </label>
                <label class="">
                    <input type="checkbox" class="topping-recommend-check-show hidden-org-checkbox" disabled="disabled" name=''><i class="fa fa-square-o fa-1x"></i><i class="fa fa-check-square-o fa-1x"></i><span class="inner-box-topping-reccomend">おすすめ！</span>
                </label>
            </div>
            `;

            document.querySelectorAll('.topping')[menuDivIndex].innerHTML += toppingStr;
            document.querySelectorAll('.topping-all-show')[menuDivIndex].innerHTML += toppingShowStr;
        });
    }


    /// ===入力されたフォームから各ボックス内パーツへデータを移動（確定または背景の黒い部分を押すと呼ばれる）
    function syncFormToFrontMenuBox() {
        ///===金額
        document.querySelectorAll('.item-value')[currentIndex].textContent = formPriceElement.value;
        ///===商品名
        document.querySelectorAll('.item-name')[currentIndex].textContent = formNameElement.value;
        ///===商品説明
        document.querySelectorAll('.item-description')[currentIndex].textContent = formItemDescriptionElement.value;
        document.querySelectorAll('.item-description-all-show')[currentIndex].textContent = formItemDescriptionElement.value;
        ///===原材料
        document.querySelectorAll('.ingredients')[currentIndex].textContent = formItemIngredientsElement.value;
        document.querySelectorAll('.ingredients-all-show')[currentIndex].textContent = formItemIngredientsElement.value;
        ///===セール価格
        document.querySelectorAll('.food-sale-price-value')[currentIndex].textContent = formSalsePriceElement.value;
        ///===セール価格適用チェックボックス
        document.querySelectorAll('.food-sale-price-check')[currentIndex].checked = formSalsePriceCheckElement.checked;
        ///===ご飯が含まれるかどうかのチェックボックス
        document.querySelectorAll('.contain-rice-check')[currentIndex].checked = formContainRiceCheckElement.checked;
        ///===おすすめメニューチェックボックス
        document.querySelectorAll('.recommended-menu-check')[currentIndex].checked = formRecommendedMenuCheckElement.checked;

        let allergenOption = document.getElementById('allergen-option');
        console.log("allergenOption.querySelectorAll('.form-allergen-check') : ", allergenOption.querySelectorAll('.form-allergen-check'));
        let formAllergenCheckBoxes = allergenOption.querySelectorAll('.form-allergen-check');

        console.log("currentIndex : ", currentIndex);

        ///ボックス側のトッピンチェックボックス、トッピングリスト
        let allergenCheckBoxes = document.querySelectorAll('.allergen')[currentIndex].querySelectorAll('.allergen-check');
        let allergenShowCheckBoxes = document.querySelectorAll('.allergen-all-show')[currentIndex].querySelectorAll('.allergen-check-show');
        // let allergenLists = document.querySelectorAll('.allergen')[currentIndex].querySelectorAll('.inner-box-allergen');
        // console.log("allergenCheckBoxes[i] : ", allergenCheckBoxes[i]);
        // console.log("allergenLists[i] : ", allergenLists[i]);

        for (i = 0; i < allergenCheckBoxes.length; i++) {
            // console.log("allergenCheckBoxes[i].checked : ", allergenCheckBoxes[i].checked);
            // console.log("allergenLists[i].innerText : ", allergenLists[i].innerText);
            // allergenCheckBoxes[i].checked = false;
            // allergenLists[i].innerText = "TEST";
            console.log("formAllergenCheckBoxes[i].checked : ", formAllergenCheckBoxes[i].checked);
            allergenCheckBoxes[i].checked = formAllergenCheckBoxes[i].checked;
            allergenShowCheckBoxes[i].checked = formAllergenCheckBoxes[i].checked;
        }

        // ///===辛さ選択
        // // document.querySelectorAll('.spiciness')[currentIndex].textContent = formItemAllergyElement.value;
        // // console.log("DBG_16_formItemSpicinessElement : ", formItemSpicinessElement);
        // /// 選択状態の値を取得
        // for ( let selectedStr="", i=formItemSpicinessElement.length; i--; ) {
        //     if ( formItemSpicinessElement[i].checked ) {
        //         let selectedStr = formItemSpicinessElement[i].value ;
        //         // console.log("DBG_17_selectedStr : ", selectedStr);
        //         document.querySelectorAll('.spiciness')[currentIndex].textContent = selectedStr;
        //         break ;
        //     }
        // }
        // ///===量の選択
        // ///選択状態の値を取得
        // for ( let selectedStr="", i=formItemAmountElement.length; i--; ) {
        //     if ( formItemAmountElement[i].checked ) {
        //         let selectedStr = formItemAmountElement[i].value ;
        //         // console.log("DBG_18_selectedStr : ", selectedStr);
        //         document.querySelectorAll('.amount')[currentIndex].textContent = selectedStr;
        //         break ;
        //     }
        // }

        ///===トッピング情報
        /// トッピング自体のチェックボックス
        let toppingOption = document.getElementById('form-topping-option');
        console.log("toppingOption.querySelectorAll('.form-topping-check') : ", toppingOption.querySelectorAll('.form-topping-check'));
        let formToppingCheckBoxes = toppingOption.querySelectorAll('.form-topping-check');
        /// トッピングに対するリコメンドのチェックボックス
        console.log("toppingOption.querySelectorAll('.form-topping-recommend-check') : ", toppingOption.querySelectorAll('.form-topping-recommend-check'));
        let formToppingRecommendCheckBoxes = toppingOption.querySelectorAll('.form-topping-recommend-check');

        console.log("formToppingRecommendCheckBoxes : ", formToppingRecommendCheckBoxes);
        console.log("currentIndex : ", currentIndex);

        /// 確定を押してモーダルフォームからフロントのボックスへデータを入れる
        ///ボックス側のトッピンチェックボックス、トッピングリスト
        let toppingCheckBoxes = document.querySelectorAll('.topping')[currentIndex].querySelectorAll('.topping-check');
        let toppingShowCheckBoxes = document.querySelectorAll('.topping-all-show')[currentIndex].querySelectorAll('.topping-check-show');
        ///ボックス側のトッピンリコメンドチェックボックス、トッピングリスト
        let toppingRecommendCheckBoxes = document.querySelectorAll('.topping')[currentIndex].querySelectorAll('.topping-recommend-check');
        let toppingRecommendShowCheckBoxes = document.querySelectorAll('.topping-all-show')[currentIndex].querySelectorAll('.topping-recommend-check-show');

        console.log("toppingRecommendCheckBoxes : ", toppingRecommendCheckBoxes);
        console.log("toppingRecommendShowCheckBoxes : ", toppingRecommendShowCheckBoxes);

        // let toppingLists = document.querySelectorAll('.topping')[currentIndex].querySelectorAll('.inner-box-topping');
        // console.log("toppingCheckBoxes[i] : ", toppingCheckBoxes[i]);
        // console.log("toppingLists[i] : ", toppingLists[i]);

        for (i = 0; i < toppingCheckBoxes.length; i++) {
            // console.log("toppingCheckBoxes[i].checked : ", toppingCheckBoxes[i].checked);
            // console.log("toppingLists[i].innerText : ", toppingLists[i].innerText);
            // toppingCheckBoxes[i].checked = false;
            // toppingLists[i].innerText = "TEST";
            console.log("formToppingCheckBoxes[i].checked : ", formToppingCheckBoxes[i].checked);
            console.log("formToppingRecommendCheckBoxes[i].checked : ", formToppingRecommendCheckBoxes[i].checked);
            toppingCheckBoxes[i].checked = formToppingCheckBoxes[i].checked;
            toppingShowCheckBoxes[i].checked = formToppingCheckBoxes[i].checked;
            toppingRecommendCheckBoxes[i].checked = formToppingRecommendCheckBoxes[i].checked;
            toppingRecommendShowCheckBoxes[i].checked = formToppingRecommendCheckBoxes[i].checked;
        }

        ///===汎用オプション
        /// トッピング自体のチェックボックス
        let formGeneralOption = document.getElementById('form-general-option');
        console.log("formGeneralOption.querySelectorAll('.form-option-check') : ", formGeneralOption.querySelectorAll('.form-option-check'));
        let formGeneralOptionCheckBoxes = formGeneralOption.querySelectorAll('.form-option-check');
        /// トッピングに対するリコメンドのチェックボックス
        console.log("formGeneralOption.querySelectorAll('.form-option-recommend-check') : ", formGeneralOption.querySelectorAll('.form-option-recommend-check'));
        let formGeneralOptionRecommendCheckBoxes = formGeneralOption.querySelectorAll('.form-option-recommend-check');

        console.log("formGeneralOptionRecommendCheckBoxes : ", formGeneralOptionRecommendCheckBoxes);
        console.log("currentIndex : ", currentIndex);

        /// 確定を押してモーダルフォームからフロントのボックスへデータを入れる
        ///ボックス側のトッピンチェックボックス、トッピングリスト
        let generalOptionCheckBoxes = document.querySelectorAll('.general-option')[currentIndex].querySelectorAll('.general-option-check');
        let generalOptionShowCheckBoxes = document.querySelectorAll('.general-option-all-show')[currentIndex].querySelectorAll('.general-option-check-show');
        ///ボックス側のトッピンリコメンドチェックボックス、トッピングリスト
        let generalOptionRecommendCheckBoxes = document.querySelectorAll('.general-option')[currentIndex].querySelectorAll('.general-option-recommend-check');
        let generalOptionRecommendShowCheckBoxes = document.querySelectorAll('.general-option-all-show')[currentIndex].querySelectorAll('.general-option-recommend-check-show');

        // return;

        console.log("generalOptionRecommendCheckBoxes : ", generalOptionRecommendCheckBoxes);
        console.log("generalOptionRecommendShowCheckBoxes : ", generalOptionRecommendShowCheckBoxes);

        // let GeneralOptionLists = document.querySelectorAll('.GeneralOption')[currentIndex].querySelectorAll('.inner-box-GeneralOption');
        // console.log("generalOptionCheckBoxes[i] : ", generalOptionCheckBoxes[i]);
        // console.log("GeneralOptionLists[i] : ", GeneralOptionLists[i]);

        for (i = 0; i < generalOptionCheckBoxes.length; i++) {
            // console.log("generalOptionCheckBoxes[i].checked : ", generalOptionCheckBoxes[i].checked);
            // console.log("GeneralOptionLists[i].innerText : ", GeneralOptionLists[i].innerText);
            // generalOptionCheckBoxes[i].checked = false;
            // GeneralOptionLists[i].innerText = "TEST";
            console.log("formGeneralOptionCheckBoxes[i].checked : ", formGeneralOptionCheckBoxes[i].checked);
            console.log("formGeneralOptionRecommendCheckBoxes[i].checked : ", formGeneralOptionRecommendCheckBoxes[i].checked);
            generalOptionCheckBoxes[i].checked = formGeneralOptionCheckBoxes[i].checked;
            generalOptionShowCheckBoxes[i].checked = formGeneralOptionCheckBoxes[i].checked;
            generalOptionRecommendCheckBoxes[i].checked = formGeneralOptionRecommendCheckBoxes[i].checked;
            generalOptionRecommendShowCheckBoxes[i].checked = formGeneralOptionRecommendCheckBoxes[i].checked;
        }

        ///===内容量
        document.querySelectorAll('.contents-gram-value')[currentIndex].textContent = formContentsGramElement.value;

        ///===保存方法、消費期限
        ///保存方法のセレクト番号
        const formPreservationNumElement = document.getElementById("form-preservation-num");
        console.log("formPreservationNumElement : ", formPreservationNumElement);
        console.log("formPreservationNumElement.innerText : ", formPreservationNumElement.innerText);

        // const formPreservationElement = document.getElementById("preservation-method-text");
        // const formExpirationElement = document.getElementById("expiration-date-text");

        // if ()
        // let preservationExpirationInnerHTML = formPreservationElement.innerHTML + formExpirationElement.innerHTML;
        // let preservationExpirationInnerHTML = "DBG";

        // alert(formPreservationSelectboxElement)
        console.log("DBG_21_formPreservationSelectboxElement.value : ", formPreservationSelectboxElement.value);
        // let boxPreservationTxt = "";
        // let boxPreservationTxtAllShow = "";
        let preservationNumText = "";
        let preservationText = "";
        ///nullまたは空文字だったら
        if (!formPreservationSelectboxElement.value) {
            // let boxPreservationTxt = "";
            preservationNumText = "";
            preservationText = "";
        } else if (formPreservationSelectboxElement.value == 1) {
            // boxPreservationTxt = `<span class="preservation-num">1</span><span class="preservation-text">.直射日光を避け涼しい所で保管し、期限内にお早めにお召し上がりください。消費期限：製造時刻から${3}時間</span>`
            // boxPreservationTxtAllShow = `<span class="preservation-num-all-show">1</span><span class="preservation-text-all-show">.直射日光を避け涼しい所で保管し、期限内にお早めにお召し上がりください。消費期限：製造時刻から${3}時間</span>`

            preservationNumText = 1;
            preservationText = `.直射日光を避け涼しい所で保管し、期限内にお早めにお召し上がりください。消費期限：製造時刻から${3}時間`;
        } else if (formPreservationSelectboxElement.value == 2) {
            // boxPreservationTxt = `<span class="preservation-num">2</span>.冷蔵庫に保存して下さい。` + `消費期限：<span></span><span>製造時刻から<span class="expiration-time">${3*24}</span>時間（3日後）</span>`
            // boxPreservationTxtAllShow = `<span class="preservation-num-all-show">2</span>.直射日光を避け涼しい所で保管し、期限内にお早めにお召し上がりください。` + `消費期限：<span></span><span>製造時刻から<span class="expiration-time-num-all-show">${3*24}</span>時間（3日後）</span>`
            preservationNumText = 2;
            preservationText = `.直射日光を避け涼しい所で保管し、期限内にお早めにお召し上がりください。消費期限：製造時刻から${3 * 24}時間（3日後）`;
        } else if (formPreservationSelectboxElement.value == 3) {
            // boxPreservationTxt = `<span class="preservation-num">3</span>.冷蔵庫に保存して下さい。` + `消費期限：<span></span><span>製造時刻から<span class="expiration-time">${21*24}</span>時間（21日後）</span>`
            // boxPreservationTxtAllShow = `<span class="preservation-num-all-show">3</span>.直射日光を避け涼しい所で保管し、期限内にお早めにお召し上がりください。` + `消費期限：<span></span><span>製造時刻から<span class="expiration-time-num-all-show">${21*24}</span>時間（21日後）</span>`
            preservationNumText = 3;
            preservationText = `.直射日光を避け涼しい所で保管し、期限内にお早めにお召し上がりください。消費期限：製造時刻から${21 * 24}時間（21日後）`;
        }

        // let preservationExpirationInnerHTML = `<span class="preservation-num">1</span>.直射日光を避け涼しい所で保管し、期限内にお早めにお召し上がりください。` + `消費期限：<span></span><span>製造時刻から<span class="expiration-time">${3}</span>時間</span>`;
        // document.querySelectorAll('.preservation-expiration')[currentIndex].innerHTML = boxPreservationTxt;
        // document.querySelectorAll('.preservation-expiration-all-show')[currentIndex].innerHTML = boxPreservationTxtAllShow;

        console.log("currentIndex : ", currentIndex);
        console.log("入れるj番目の保存方法の番号データ : ", preservationNumText);
        console.log("入れるj番目の保存方法のテキストデータ : ", preservationText);
        console.log("入れられるj番目の保存方法データ : ", document.querySelectorAll('.preservation-num')[currentIndex].innerHTML);

        document.querySelectorAll('.preservation-num')[currentIndex].innerHTML = preservationNumText;
        document.querySelectorAll('.preservation-text')[currentIndex].innerHTML = preservationText;
        // document.querySelectorAll('.preservation-num-all-show')[currentIndex].innerHTML = preservationNumText;
        // document.querySelectorAll('.preservation-text-all-show')[currentIndex].innerHTML = preservationText;
    }

    function updatePreservationExpiration() {
        console.log("===DBG30");
        const formPreservationNumElement = document.getElementById("form-preservation-num");
        console.log("formPreservationNumElement : ", formPreservationNumElement);
        console.log("formPreservationNumElement.innerText : ", formPreservationNumElement.innerText);
        console.log("===DBG30 FIn");

        if (formPreservationSelectboxElement.value == 1) {
            console.log("1を選択");
            // formPreservationElement.innerHTML = `<span id="form-preservation-num">1</span>.直射日光を避け涼しい所で保管し、期限内にお早めにお召し上がりください。`;
            // formExpirationElement.innerHTML = `<span></span><span>製造時刻から<span id="form-expiration-time">${3}</span>時間</span>`;
            formPreservationElement.innerHTML = `<span id="form-preservation-num">1</span>.直射日光を避け涼しい所で保管し、期限内にお早めにお召し上がりください。`;
            formExpirationElement.innerHTML = `<span></span><span>製造時刻から<span id="form-expiration-time">${3}</span>時間</span>`;
        } else if (formPreservationSelectboxElement.value == 2) {
            console.log("2を選択");
            formPreservationElement.innerHTML = `<span id="form-preservation-num">2</span>.冷蔵庫に保存して下さい。`;
            formExpirationElement.innerHTML = `<span></span><span>製造時刻から<span id="form-expiration-time">${3 * 24}</span>時間（3日後）</span>`;
        } else if (formPreservationSelectboxElement.value == 3) {
            console.log("3を選択");
            formPreservationElement.innerHTML = `<span id="form-preservation-num">3</span>.冷蔵庫に保存して下さい。`;
            formExpirationElement.innerHTML = `<span></span><span>製造時刻から<span id="form-expiration-time">${21 * 24}</span>時間（21日後）</span>`;
        }
        ///nullまたは空文字だったら
        else if (!formPreservationSelectboxElement.value) {
            // alert("選択なし")
            formPreservationElement.innerHTML = ``;
            formExpirationElement.innerHTML = ``;
        }
    }


    document.getElementById("menu-ok").onclick = function () {
        console.log("確定");
        console.log("currentIndex : ", currentIndex);

        /// 入力されたフォームから各パーツへデータを移動
        syncFormToFrontMenuBox();

        $('#modalArea').fadeOut();
        // modalAreaElement.style.display ="none";
    }

    // formPreservationSelectboxElement.options[2].selected = true

    formPreservationSelectboxElement.onchange = function () {
        console.log("formPreservationSelectboxElement.value : ", formPreservationSelectboxElement.value);

        /// 保存方法と消費期限のテキストを更新
        updatePreservationExpiration();
    };

    // ///===トッピング登録
    // //今日の日付を取得
    // let date = new Date();
    // let month = date.getMonth() + 1;
    // let year = date.getFullYear();
    // let day = date.getDate();

    // //今日の日付を表示
    // // document.getElementById("today").innerHTML =
    // // year + "年" + month + "月" + day + "日のTODOリスト";

    // //リストに番号をふってユニーク化するため変数numberを定義
    // let number = 0;

    // //追加ボタンでリストを追加する
    // document.getElementById("add-topping").addEventListener("click", function () {
    //     number++;
    //     let input1 = document.querySelector("#input1");
    //     let result = input1.value;
    //     let checkbox = document.createElement("input");
    //     checkbox.className = "custom-control-input";
    //     checkbox.setAttribute("type", "checkbox");

    //     // let checkboxdiv = document.createElement("div");
    //     // checkboxdiv.className = "col-xs-1 custom-control custom-checkbox";
    //     // checkboxdiv.appendChild(checkbox);

    //     //入力が空だった場合と、文字数制限を超えた場合にアラートを出す。
    //     if (result == "") {
    //         alert("入力してください");
    //     } else if (result.length > 21) {
    //         alert("20文字以下で入力してください");

    //         //上記の場合以外はリストを追加する。
    //     } else {
    //         let list = document.createElement("p");
    //         list.className = "list";
    //         list.innerHTML = result;

    //         let listdiv = document.createElement("div");
    //         // listdiv.className = "col-xs-8";
    //         listdiv.appendChild(list);

    //         let list_price = document.createElement("p");
    //         list_price.className = "list-price";
    //         list_price.innerHTML = result;

    //         let list_pricediv = document.createElement("div");
    //         // list_pricediv.className = "col-xs-8";
    //         list_pricediv.appendChild(list_price);

    //         let deleteButton = document.createElement("button");
    //         let deleteid = "delete" + number;
    //         deleteButton.className = "delete";
    //         deleteButton.setAttribute("id", deleteid);
    //         deleteButton.setAttribute("value", number);
    //         deleteButton.innerHTML = "削除";

    //         let deletediv = document.createElement("div");
    //         // deletediv.className = "col-xs-3";
    //         deletediv.appendChild(deleteButton);

    //         let div = document.createElement("div");
    //         let todolist = "todolist" + number;
    //         // div.className = "row";
    //         div.className = "my-row";
    //         div.setAttribute("id", todolist);
    //         div.setAttribute("value", number);
    //         // div.appendChild(checkboxdiv);
    //         div.appendChild(listdiv);
    //         div.appendChild(list_pricediv);
    //         div.appendChild(deletediv);

    //         document.getElementById("todolist_unit").appendChild(div);

    //         //区切り線を引く。
    //         // let line = document.createElement("hr");
    //         // line.classList.add("topping-section-hr");
    //         // let listline = "listline" + number;
    //         // line.setAttribute("id", listline);
    //         // document.getElementById("todolist_unit").appendChild(line);

    //         //フォーム入力し、追加ボタンを押したらフォームをクリアする。
    //         let reset = document.getElementById("input1");
    //         reset.value = "";

    //         //削除ボタンが押されたら、そのリストを削除する。
    //         document.getElementById(deleteid).addEventListener("click", function () {
    //         document.getElementById(todolist).remove(todolist);
    //         document.getElementById(listline).remove(listline);
    //         });
    //     }
    // });

    ///===トッピング登録（DBからではなく手動入力側）
    document.getElementById("add-topping").addEventListener("click", function () {
        let topping_item_input = document.querySelector("#topping-item-input");
        let result_item = topping_item_input.value;
        let topping_value_input = document.querySelector("#topping-value-input");
        let result_value = topping_value_input.value;

        ///入力が空だった場合と、文字数制限を超えた場合にアラートを出す。
        if (result_item == "" || result_value == "") {
            alert("空欄があります");
            ///文字数制限を入れる場合
            // } else if (result.length > 21) {
            //     alert("20文字以下で入力してください");
            return;
        }
        ///金額が数値出ない文字を含んでいたらreturn
        if (isNaN(result_value)) {
            alert("金額には半角の数値のみを入力してください");
            return;
        }
        ///金額にスペース（半角スペースまたは全角スペース）が入っていたらreturn
        if (result_value.match(/ /) || result_value.match(/　/)) {
            alert("金額にスペースが入っています");
            return;
        }
        ///商品名にスペース（半角スペースまたは全角スペース）が入っていたらreturn
        if (result_item.match(/ /) || result_item.match(/　/)) {
            alert("商品名にスペースが入っています");
            return;
        }

        /// tableへ追加する処理
        let toppingTable = document.getElementById('topping-table');
        let row = toppingTable.insertRow();
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);
        let cell5 = row.insertCell(4);
        let cell6 = row.insertCell(5);

        /// トッピング名
        let HTML1 = '<td><span class="topping-item topping-general-text">' + result_item + '</span><span class="topping-edit"><i class="fas fa-pen"></i></span></td>';
        /// 通常価格
        let HTML2 = '<td><span class="topping-value topping-general-text">' + result_value + '</span>円<span class="topping-edit"><i class="fas fa-pen"></i></span></td>';
        /// セール価格増減
        let HTML3 = '<td><span class="topping-sale-price topping-general-text">' + 0 + '</span>円<span class="topping-edit"><i class="fas fa-pen"></i></span></td>';
        /// セール適用チェックボックス
        let HTML4 = `
                    <td>
                        <label class="sale-checkbox-label">
                            <input class="topping-sale-checkbox" type="checkbox" name="topping-sale-price-checkbox-name">セール価格を適用
                        </label>
                    </td>
                    `;
        /// 原材料
        let HTML5 = '<td><span class="topping-material topping-general-text">' + result_item + '</span><span class="topping-edit"><i class="fas fa-pen"></i></span></td>';
        /// 削除ボタン
        let HTML6 = '<input type="button" class="btn btn-danger" value="削除" onclick="deleteRow(this)" />';

        cell1.innerHTML = HTML1;
        cell2.innerHTML = HTML2;
        cell3.innerHTML = HTML3;
        cell4.innerHTML = HTML4;
        cell5.innerHTML = HTML5;
        cell6.innerHTML = HTML6;

        topping_item_input.value = "";
        topping_value_input.value = "";

        ///トッピングリストが変わったので、トッピングオプションをリセットする
        // resetToppingOption();

        /// トッピングリストが変わったので、追加された分のトッピングを各メニューのトッピング候補に追加する
        // let addedToppingName = document.getElementById("topping-table");
        // let addedToppingName = obj.parentNode.parentNode.childNodes[0].outerText;
        let toppingTableElement = document.getElementById('topping-table');
        console.log('toppingTableElement : ', toppingTableElement);
        console.log('toppingTableElement.lastChild.lastChild.firstChild : ', toppingTableElement.lastChild.lastChild.firstChild);
        console.log("toppingTableElement.lastChild.lastChild.firstChild.querySelector('.topping-item') : ", toppingTableElement.lastChild.lastChild.firstChild.querySelector('.topping-item'));
        let addedToppingName = toppingTableElement.lastChild.lastChild.firstChild.querySelector('.topping-item').innerText;
        console.log('addedToppingName : ', addedToppingName);
        diffToppingAdd(addedToppingName);
    });

    /// 各メニュー内のトッピングリストのうち、削除されたトッピングの項目のみを削除（この部分のみを削除することで、元々の設定値が変わらずに済む）
    function diffToppingDelete(deletedToppingName) {
        console.log("---diffToppingDelete");
        console.log("menu-divs", document.querySelectorAll('.menu-divs'));
        let meuDivs = document.querySelectorAll('.menu-divs');
        meuDivs.forEach((p, menuDivIndex) => {
            console.log("menuDivIndex : ", menuDivIndex);
            console.log("item-name : ", meuDivs[menuDivIndex].querySelector(".item-name").textContent);
            console.log("topping : ", meuDivs[menuDivIndex].querySelector(".topping"));
            let toppingArr = meuDivs[menuDivIndex].querySelector(".topping").querySelectorAll('.topping-front-one-set');
            console.log("toppingArr : ", toppingArr);
            for (i = 0; i < toppingArr.length; i++) {
                console.log("toppingArr[i] : ", toppingArr[i]);
                console.log("toppingArr[i].querySelector('.inner-box-topping') : ", toppingArr[i].querySelector('.inner-box-topping'));

                console.log("toppingArr[i].querySelector('.inner-box-topping').textContent : ", toppingArr[i].querySelector('.inner-box-topping').textContent);
                /// トッピング名（例：たらこ）
                let toppingName = toppingArr[i].querySelector('.inner-box-topping').textContent;
                if (toppingName == deletedToppingName) {
                    console.log("削除");
                    // 削除するのはtoppingArr[i]の階層
                    toppingArr[i].remove();
                }
                // .querySelector(".inner-box-topping")
            }
            console.log("meuDivs['menuDivIndex'] : ", meuDivs[menuDivIndex]);
            console.log("meuDivs['menuDivIndex'].getElementsByClassName('item-name') : ", meuDivs[menuDivIndex].getElementsByClassName('item-name'));
            // console.log("meuDivs['menuDivIndex'].querySelector('topping-front-one-set') : " , meuDivs['menuDivIndex'].querySelector('topping-front-one-set'));
            // let itemName = meuDivs[menuDivIndex].querySelector(".item-name").textContent;
            // referenceSortItemNameArray.push(itemName);
        });
    }

    //選択された行を削除
    function deleteRow(obj) {
        console.log("---deleteRow");
        // 削除ボタンを押下された行を取得
        tr = obj.parentNode.parentNode;
        // trのインデックスを取得して行を削除する
        tr.parentNode.deleteRow(tr.sectionRowIndex);

        console.log("obj.parentNode : ", obj.parentNode);
        console.log("obj.parentNode.parentNode : ", obj.parentNode.parentNode);
        console.log("obj.parentNode.parentNode.childNodes : ", obj.parentNode.parentNode.childNodes);
        console.log("obj.parentNode.parentNode.childNodes[0].outerText : ", obj.parentNode.parentNode.childNodes[0].outerText);
        /// 削除されたトッピング名（例：たらこ）
        let deletedToppingName = obj.parentNode.parentNode.childNodes[0].outerText;

        // console.log("obj.parentNode.parentNode.querySelectorAll('topping-item') : " , obj.parentNode.parentNode.querySelectorAll('topping-item'));
        // console.log("obj.parentNode.parentNode['topping-item'] : " , obj.parentNode.parentNode['topping-item']);

        /// トッピングリストが変わったので、トッピングオプションをリセットする
        // resetToppingOption();
        /// 差分検出方式へ
        diffToppingDelete(deletedToppingName);
        return;
    }

    // let targets = document.getElementsByClassName("type-tab");
    // console.log("targets : " , targets);
    // for(let i = 0; i < targets.length; i++){
    //   console.log("targets i : " , i);
    //   targets[i].addEventListener("click",() => {
    //         alert("CLASS: XXXがクリックされました。");
    //   }, false);
    // }

    // var trigger = document.querySelectorAll(".type-tab");
    // trigger.forEach(function(target) {

    //     // target.addEventListener('mouseenter', function() {
    //         target.on('click', '.type-tab', function(e){

    //         // target.firstElementChild.style.display = 'block';
    //         alert("CLASS: XXXがクリックされました。");
    //     });

    //     // target.addEventListener('mouseleave', function() {
    //     //     // target.firstElementChild.style.display = 'none';
    //     // });
    // });

    // let targets = document.getElementsByClassName("type-tab");
    // console.log("targets : " , targets);
    // for(let i = 0; i < targets.length; i++){
    //   console.log("targets i : " , i);
    //   targets[i].on('click','.type-tab',function(){
    //       alert("CLASS: XXXがクリックされました。");
    //   });
    // }

    // targets[i].addEventListener("click",() => {
    //       alert("CLASS: XXXがクリックされました。");
    //   }, false);
    // }



    // var el = document.querySelectorAll(".type-tab"); // this element contains more than 1 DOMs.
    // for(var i =0; i < el.length; i++) {
    //     el[i].onclick = function() {
    //         console.log("target name should be here")
    //         alert("CLASS: XXXがクリックされました。");
    //     };
    // }

    // document.addEventListener('click', function (e) {
    //     // idの場合はこう
    //     // if (e.target.id === 'hoge') {
    //     // class名指定の場合はこう
    //     // if (e.target.classList.contains('hoge')) {
    //     // タグ名指定の場合はこう(大文字で取れるのでtoLowerCaseしている)
    //     if (e.target.tagName.toLowerCase() === 'p') {
    //         e.target.insertAdjacentHTML('afterend', "<p>これもクリックできる</p>")
    //     }
    // });


}