/**
 * RcmEventListDisplay
 *
 * JS for editing RcmEventListDisplay
 *
 * PHP version 5.3
 *
 * LICENSE: No License yet
 *
 * @category  Reliv
 * @package   RcmPlugins\RcmEventListDisplay
 * @author    Rod McNew <rmcnew@relivinc.com>
 * @copyright 2012 Reliv International
 * @license   License.txt New BSD License
 * @version   GIT: <git_id>
 * @link      http://ci.reliv.com/confluence
 */

/**
 * Synchronously grab dependency object file(s)
 */
$.ajax({
    async: false,
    url: '/modules/rcm/js/admin/ajax-edit-helper.js',
    dataType: 'script'
});
$.ajax({
    async: false,
    url: '/modules/rcm-event-calender-core/rcm-event-manager.js',
    dataType: 'script'
});

var RcmEventListDisplayEdit = function (instanceId, container) {

    /**
     * Always refers to this object unlike the 'this' JS variable;
     *
     * @type {RcmEventListDisplayEdit}
     */
    var me = this;

    /**
     * Settings from db
     * @type {Object}
     */
    var data;

    /**
     * Default settings from config json file
     * @type {Object}
     */
    var defaultData;

    var ajaxEditHelper = new AjaxEditHelper(instanceId, 'rcm-event-list-display');

    var eventManager = new RcmEventManager(
        container.find('dataContainer').attr('data-eventCategoryId')
    );

    /**
     * Called by content management system to make this plugin user-editable
     */
    me.initEdit = function () {
        ajaxEditHelper.getInstanceConfigAndNewInstanceConfigFromServer(me.completeEditInit);
    };

    /**
     * Completes edit init process after we get data from server
     *
     * @param {Object} returnedData
     * @param {Object} returnedDefaultData
     */
    me.completeEditInit = function(returnedData, returnedDefaultData){
        data = returnedData;
        defaultData = returnedDefaultData;

        //Double clicking will show properties dialog
        container.delegate('.event', 'dblclick', me.handleOpenEventManager);

        //Add right click menu
        rcmEdit.pluginContextMenu(
            {
                selector:rcm.getPluginContainerSelector(instanceId),
                //Here are the right click menu options
                items:{
                    eventManager:{
                        name:'Open Event Manager (Add/Remove/Edit Events)',
                        icon:'edit',
                        callback:eventManager.showManager
                    },
                    'sep1':'-',
                    edit:{
                        name:'Properties for this Event List Display',
                        icon:'edit',
                        callback:me.showEditDialog
                    }
                }
            }
        );
    };

    me.handleOpenEventManager = function(){
        var eventId = $(this).attr('data-eventId');
        alert(eventId);
    };

    /**
     * Called by content management system to get this plugins data for saving
     * on the server
     *
     * @return {Object}
     */
    me.getSaveData = function () {
        return data;
    };

    me.showEditDialog = function(){
        eventManager.getCategories(me.showContinueEditDialog);
    };

    /**
     * Displays a dialog box to edit href and image src
     *
     */
    me.showContinueEditDialog = function(categories){
        //Create and show our edit dialog
        var form = $('<form></form>').addClass('simple');
        form.addSelect(
            'categoryId',
            'Event Category',
            categories,
            data.categoryId
        );
        form.addInput(
            'shareThisKey',
            '"ShareThis" Published Key',
            data.shareThisKey
        );
        form.append('<p style="font-weight:bold;">Translations:</p>');
        $.each(defaultData.translate, function(key, value){
            form.addInput(key, value, data.translate[key] );
        });

        form.dialog({
                title:'Properties',
                modal:true,
                width:620,
                buttons:{
                    Cancel:function () {
                        $(this).dialog("close");
                    },
                    Ok:function () {

                        //Get user-entered data from form
                        data.categoryId= form.find('[name=categoryId]').val();
                        data.shareThisKey= form.find('[name=shareThisKey]').val();

                        $.each(defaultData.translate, function(key){
                            data.translate[key] = form.find('[name="'+key+'"]')
                                .val();
                        });

                        me.render();

                        $(this).dialog("close");
                    }
                }
            });

    };

    me.render = function(){
        container.load(
            '/rcm-plugin-admin-proxy/rcm-event-list-display/'
                + instanceId + '/preview'
            ,data
            ,function(){
                rcmSocialButtonsReload();
            }
        );
    };

    //Re-render the list if events change in the event manager
    $('body').bind('rcmEventManagerRender',me.render);
};