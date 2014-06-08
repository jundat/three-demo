<div class="container">
      <header>
        <div class="row_lobby header_top">
          <div class="col-xs-2 lobby_btn_pre">
            <a id="switchBt" href="#" class="btn btn-pre">&nbsp;</a>
          </div><!-- / .col-xs-2 -->

          <div class="col-xs-3 lobby_btn_training mode-real" id = "game_mode"></div>

          <div class="col-xs-5 lobby_header_info"  id="header_info" style="padding-top: 6px;">
           
            <div class="row_lobby">
              <span class="inline">プレイヤー名:</span>
              <span class="inline info_name"><b>Body 1</b></span>
            </div><!-- / .row_lobby -->  

            <div class="row_lobby">
              <span class="inline">所持金:</span>
              <span class="inline info_balance"><b>Body 2</b></span>
            </div><!-- / .row_lobby -->
              
          </div><!-- / .col-xs-5 -->

          <div class="col-xs-2 lobby_btn_close" id="wp-btn-close">
            <a href="#" class="btn btn-close" id = "logoutBt"></a>
          </div><!-- / .col-xs-2 -->
        </div><!-- / .row_lobby header_top -->  

        
      </header>

      <section class="wp row_lobby">
        <!-- left -->
        <div class="col-xs-9 wp-left">
          <!-- wp-search -->
          <div class="row_lobby wp-search">
            <form class="form-horizontal" role="form">
                  <div class="row_lobby">
                    <div class="col-xs-6 frm-left">
                      <div class="form-group">
                        <label class="col-xs-4 control-label" style="white-space: nowrap;padding-top: 12px;">ルームオーナー</label>
                        <div class="col-xs-7">
                          <input id = "filter_name" type="text" class="form-control form-input">
                        </div>
                      </div> 

                      <div class="form-group">
                        <label class="col-xs-4 control-label" style="white-space: nowrap;padding-top: 12px;">ルーム名</label>
                        <div class="col-xs-7">
                          <input id = "filter_owner" type="text" class="form-control form-input">
                        </div>
                      </div>


                    </div><!-- / .col-xs-6 -->

                    <div class="col-xs-6 frm-right">

                      <div class="form-group">
                          <label class="control control-label" style="white-space: nowrap;padding-top: 12px;">開始ベット</label>
                          <input id = "filter_minBet_begin" class="form-control form-input inputNum" type="text" name="bet-from">
                          <span class="input-group-addon">  &nbsp;   ~</span>
                          <input id = "filter_minBet_end" class="form-control form-input inputNum" type="text" name="bet-to">
                          <span class="input-group-addon"></span>
                           
                      </div>

                      <div class="form-group">
                          <label class="control control-label" style="white-space: nowrap;padding-top: 12px;">ルームデポジット</label>
                          <input class="form-control form-input inputNum" type="text" name="bet-from">
                          <span class="input-group-addon">  &nbsp;   ~</span>
                          <input id = "filter_maxBet_end" class="form-control form-input inputNum" type="text" name="bet-to">
                          <span class="input-group-addon"></span>
                           
                      </div>

                      
                      
                    </div><!-- / .col-xs-6 -->
                  </div><!-- / .row_lobby -->
                  
                  <div class="clear"></div><!-- / .clear -->

                  <!-- btn -->
                  <div class="row_lobby btn-frm text-center">                    
                    <button type="button" id="btnLobbySearch" class="btn btn-search"></button>
                    <button type="button" id="btnLobbySearchClear" class="btn btn-clear"></button>  
                  </div><!-- / .row_lobby btn-search -->
              </form>  

          </div><!-- / .row_lobby wp-search -->


          <!-- wp-body -->
          <div class="row_lobby wp-body">
            <div id="wp-table" class="scroll" style="margin-left:28px;overflow: hidden; outline: none;">
              <table id="tblRoom" class="table  table-bordered">
                <thead>
                  <tr>
                      	<th>
							 ルーム名
						</th>
						<th>
							 ルームオーナー
						</th>
						<th>
							 開始ベット
						</th>
						<th>
							 ルームデポジット
						</th>
						<th>
							 プレイヤー数
						</th>
						<th>
							 ステータス
						</th>
						<th>
							入室
						</th>
                      
                      
                  </tr>
              </thead>

              <tbody>
             


              </tbody>


              </table><!-- / .table table-striped table-bordered table-hover -->
            </div><!-- / #wp-table -->  
          </div><!-- / .row_lobby wp-body -->

           
          <div class="row_lobby">
            <button id="createGameBt" type="button" class="btn btn-room"></button>  
          </div><!-- / .row_lobby -->
          

        </div><!-- / .col-xs-8 wp-left --> 
        
        <!-- right -->
        <div class="col-xs-3 wp-right">
          <div class="wp-chat">
            <div class="chat-header">
              
            </div><!-- / .chat-header -->

            <div id="publicChatAreaPn" class="scroll chat-body">            
            </div><!-- / .chat-body -->
	
            <div class="chat-footer">
              <form class="form-horizontal" role="form">
                
                <input type="text" class="form-control pull-left" id="publicMsgIn" />
                <button type="button" id="sendPublicMsgBt" class="form-control  btn btn-message pull-left"></button>

              </form> 
              <div style="clear: both"></div><!-- / .clearfix -->
            </div><!-- / .chat-footer -->
            

            
          </div><!-- / .wp-chat -->  
        </div><!-- / .col-xs-4 wp-right -->   

        <div class="clear"></div>
      </section><!-- / .wp --> 
    </div><!-- / .container -->