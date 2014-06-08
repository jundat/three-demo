
    <div id="createGameWin" class="container popup">
      <header id="popup_header">
        <span class="popup_title inline">新しいルーム作成</span>
        <a class="btn btn-close pull-right" id = "closeCreateWindowBt" href="#"></a>  
      </header><!-- / #popup_header -->
      
      <section class="wp">
        <div class="form-horizontal" role="form" id="popup_frm">
            <div class="row">
              <div class="form-group">
                <label class="col-xs-5 control-label text-right">ルーム名</label>
                <div class="col-xs-6">
                  <input id="gameNameIn" type="text" class="form-control form-input">
                </div>
              </div> 

              <div class="form-group">
                <label class="col-xs-5 control-label text-right">開始ベット</label>
                <div class="col-xs-6">
                  <input id="gameMinBet" type="text" class="form-control form-input">
                </div>
              </div> 

              <div class="form-group">
                <label class="col-xs-5 control-label text-right">ルームデポジット</label>
                <div class="col-xs-6">
                  <input id="gameMaxBet" type="text" class="form-control form-input">
                </div>
              </div>

              <div class="form-group">
                <label class="col-xs-5 control-label text-right">パスワード</label>
                <div class="col-xs-6">
                  <input type="password" id="gamePassword" type="text" class="form-control form-input">
                </div>
              </div> 
            </div><!-- / .row -->

            <!-- btn -->
            <div class="row btn-frm text-center" style="margin-top:15px;">
              <button type="button" id="doCreateGameBt" class="btn popup-btn-search"></button>
              <button type="button" id="cancelBt" class="btn popup-btn-clear"></button>  
            </div><!-- / .row btn-search -->

        </div>
      </section><!-- / .wp -->

    </div><!-- / .container popup -->